import { Nullable, Utils } from '@voiceflow/common';
import { IntentClassificationType } from '@voiceflow/dtos';
import { clsx, tid } from '@voiceflow/style';
import { Box, Divider, Link, Notification, notify, Scroll, Section, SmallDataTable, Text, TextArea, Tip, Tokens, Tooltip } from '@voiceflow/ui-next';
import { validatorFactory } from '@voiceflow/utils-designer';
import React, { useRef, useState } from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';
import { flushSync } from 'react-dom';

import { Modal } from '@/components/Modal';
import { PreviewResultFooter } from '@/components/Preview/PreviewResultFooter/PreviewResultFooter.component';
import { DisabledBoxState } from '@/components/State/DisabledBoxState/DisabledBoxState.component';
import { TipPortal } from '@/components/Tip/TipPortal/TipPortal.component';
import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';
import { INTENT_PREVIEW_TIP_LEARN_LINK } from '@/constants/link.constant';
import { Designer, Prototype } from '@/ducks';
import { useInput, useInputState } from '@/hooks/input.hook';
import { useIntentClassificationSettings } from '@/hooks/intent.hook';
import { useAsyncEffect, useDidUpdateEffect } from '@/hooks/lifecircle.hook';
import { useNotificationDismiss } from '@/hooks/notify.hook';
import { useEnvironmentSessionStorageState } from '@/hooks/storage.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import { ModalScope } from '@/ModalsV2/modal-scope.enum';
import { NLUTrainingModelContext } from '@/pages/Project/contexts';
import { preventDefault, withEnterPress, withInputBlur } from '@/utils/handler.util';

import { modalsManager } from '../../../manager';
import { formContentStyle, modalContainerStyle, resultContentStyle } from './IntentPreview.css';
import { IntentPreviewFeedback } from './IntentPreviewFeedback.component';
import { IntentPreviewSettings } from './IntentPreviewSettings.component';

export const IntentPreviewModal = modalsManager.create(
  'IntentPreviewModal',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const MODAL_ID = 'preview-intent-modal';

      const trainingModel = React.useContext(NLUTrainingModelContext);
      const dismissableLayer = React.useContext(DismissableLayerContext);

      const storeSettings = useIntentClassificationSettings();
      const nluTrainingDiffData = useSelector(Designer.Environment.selectors.nluTrainingDiffData);

      const compilePrototype = useDispatch(Prototype.compilePrototype);
      const previewUtterance = useDispatch(Designer.Intent.effect.previewUtterance);

      const showTrainedRef = useRef(false);
      const utteranceState = useInputState();
      const trainingNotification = useNotificationDismiss();
      const [settings, setSettings] = useState(storeSettings);
      const [feedbackKey, setFeedbackKey] = useState(0);
      const [classifyStatus, setClassifyStatus] = useState<'success' | 'error'>('success');
      const [classifyLatency, setClassifyLatency] = useState(0);
      const [prototypeCompiled, setPrototypeCompiled] = useState(false);
      const [classifiedIntents, setClassifiedIntents] =
        useState<Nullable<{ nlu: Array<{ name: string; confidence: number }>; llm: Array<{ name: string }> }>>(null);
      const [lastUsedUtterance, setLastUsedUtterance] = useEnvironmentSessionStorageState(`${MODAL_ID}-last-used-utterance`, '');
      const [lastUntrainedDataCount, setLastUntrainedDataCount] = useEnvironmentSessionStorageState<null | number>(
        `${MODAL_ID}-last-untrained-data-count`,
        null
      );

      const utteranceInput = useInput<string, HTMLTextAreaElement>({
        value: utteranceState.value,
        error: utteranceState.error,
        onSave: utteranceState.setValue,
        disabled: closePrevented,
        autoFocus: true,
      });

      const validator = useValidators({
        utterance: [validatorFactory((utterance: string) => utterance.trim(), 'Utterance is required.'), utteranceState.setError],
      });

      const onSend = validator.container(async ({ utterance }) => {
        const now = Date.now();

        api.preventClose();

        try {
          const result = await previewUtterance(utterance, settings);

          utteranceState.setValue('');
          setLastUsedUtterance(utterance);

          setFeedbackKey((prev) => prev + 1);
          setClassifyStatus('success');
          setClassifiedIntents({ nlu: result.nlu.intents, llm: result.llm.intents });

          // need to flush sync to ensure the input is not disabled before the focus
          flushSync(() => api.enableClose());

          utteranceInput.ref.current?.focus();
        } catch {
          api.enableClose();

          setClassifyStatus('error');
          notify.short.error('Classification failed');
          notify.long.warning('Intent classification failed, please try again. If the issue continues contact our support team.', {
            pauseOnHover: true,
            bodyClassName: 'vfui',
          });
        }

        setClassifyLatency(Date.now() - now);
      });

      const onTrain = async () => {
        const started = await trainingModel.start({ origin: 'Intent Preview' });

        if (started) {
          const notificationID = Utils.id.cuid.slug();

          showTrainedRef.current = true;
          trainingNotification.set(notificationID);

          notify.short.info('Training', { toastId: notificationID, isLoading: true, autoClose: false });
        } else {
          notify.short.error('Training failed');
        }
      };

      const onDismissTraining = () => {
        setLastUntrainedDataCount(nluTrainingDiffData?.untrainedCount ?? -1);
      };

      const onSubmit = () => onSend({ utterance: utteranceInput.value });

      const onReuseLastUtterance = () => utteranceInput.setValue(lastUsedUtterance);

      useDidUpdateEffect(() => {
        if (trainingModel.isTraining) return;

        trainingNotification.dismiss();

        if (trainingModel.isFailed) {
          notify.short.error('Training failed');
        }
      }, [trainingModel.isTraining]);

      useDidUpdateEffect(() => {
        if (!trainingModel.isTrained || !showTrainedRef.current) return;

        notify.short.success('Trained');
      }, [trainingModel.isTrained]);

      useAsyncEffect(async () => {
        await compilePrototype();

        setPrototypeCompiled(true);

        await trainingModel.calculateDiff();
      }, []);

      const isLLMClassification = storeSettings.type === IntentClassificationType.LLM;
      const intentPreviewFeedback = !!classifiedIntents && (
        <IntentPreviewFeedback key={feedbackKey} settings={settings} utterance={lastUsedUtterance} classifiedIntents={classifiedIntents} />
      );

      return (
        <>
          <Modal.Container
            type={type}
            width="400px"
            testID={MODAL_ID}
            opened={opened}
            hidden={hidden}
            stacked
            animated={animated}
            onExited={api.remove}
            onExiting={() => dismissableLayer.dismissAllGlobally()}
            className={[formContentStyle, resultContentStyle]}
            onEscClose={api.onEscClose}
            onEnterSubmit={onSubmit}
            containerClassName={clsx('vfui', modalContainerStyle)}
          >
            <>
              <Modal.Header
                title="Intent preview"
                onClose={api.onClose}
                testID={tid(MODAL_ID, 'header')}
                secondaryButton={
                  isLLMClassification &&
                  settings.type === IntentClassificationType.LLM && (
                    <IntentPreviewSettings settings={settings} initialSettings={storeSettings} onSettingsChange={setSettings} />
                  )
                }
              />

              <Scroll style={{ display: 'block' }}>
                <Modal.Body>
                  {prototypeCompiled &&
                    trainingModel.diffStatus === NLUTrainingDiffStatus.UNTRAINED &&
                    lastUntrainedDataCount !== (nluTrainingDiffData?.untrainedCount ?? -1) && (
                      <Box pb={16}>
                        <Notification
                          type="alert"
                          content={<Text>The agent has untrained data. Train the agent for an accurate preview experience.</Text>}
                          actionButtonProps={{ label: 'Train', onClick: onTrain }}
                          secondaryButtonProps={{ label: 'Dismiss', onClick: onDismissTraining }}
                        />
                      </Box>
                    )}

                  <TextArea
                    {...utteranceInput.attributes}
                    label="Utterance"
                    testID={tid(MODAL_ID, 'utterance-input')}
                    minRows={1}
                    onKeyDown={withEnterPress(withInputBlur(preventDefault(onSubmit)))}
                    placeholder="Enter utterance"
                    errorMessage={utteranceInput.errorMessage}
                  />
                </Modal.Body>
              </Scroll>

              <Modal.Footer>
                {lastUsedUtterance ? (
                  <Modal.Footer.Button
                    label="Re-use last utterance"
                    testID={tid(MODAL_ID, 'reuse-last-utterance')}
                    variant="secondary"
                    onClick={onReuseLastUtterance}
                    disabled={closePrevented}
                  />
                ) : (
                  <Modal.Footer.Button
                    label="Cancel"
                    variant="secondary"
                    testID={tid(MODAL_ID, 'cancel')}
                    onClick={api.onClose}
                    disabled={closePrevented}
                  />
                )}

                <Tooltip
                  key={String(prototypeCompiled)}
                  placement="bottom"
                  referenceElement={({ ref, onOpen, onClose }) => (
                    <div ref={ref}>
                      <Modal.Footer.Button
                        label="Send"
                        testID={tid(MODAL_ID, 'send')}
                        variant="primary"
                        onClick={onSubmit}
                        disabled={closePrevented || !prototypeCompiled}
                        isLoading={closePrevented || !prototypeCompiled}
                        onPointerEnter={prototypeCompiled ? undefined : onOpen}
                        onPointerLeave={onClose}
                      />
                    </div>
                  )}
                >
                  {() => <Tooltip.Caption mb={0}>Compiling prototype</Tooltip.Caption>}
                </Tooltip>
              </Modal.Footer>
            </>

            {!!classifiedIntents && (
              <DisabledBoxState disabled={closePrevented} direction="column">
                {isLLMClassification && !!classifiedIntents.llm[0] && (
                  <>
                    <Section.Header.Container title="LLM classification" variant="active" pt={11} pb={7}>
                      {intentPreviewFeedback}
                    </Section.Header.Container>

                    <Box px={12} pb={20}>
                      <SmallDataTable data={[{ label: classifiedIntents.llm[0].name, value: '' }]} />
                    </Box>

                    <Divider noPadding />
                  </>
                )}

                <Section.Header.Container
                  pt={11}
                  pb={7}
                  variant="active"
                  title={(className) => (
                    <Text className={className}>
                      NLU classification{' '}
                      <Text as="span" color={Tokens.colors.neutralDark.neutralsDark100}>
                        (%)
                      </Text>
                    </Text>
                  )}
                >
                  {!isLLMClassification && intentPreviewFeedback}
                </Section.Header.Container>

                <Box px={12} pb={20}>
                  <SmallDataTable
                    data={classifiedIntents.nlu.map((item) => ({ label: item.name, value: String(Math.round(item.confidence * 100)) }))}
                  />
                </Box>

                <PreviewResultFooter status={classifyStatus} latency={classifyLatency} />
              </DisabledBoxState>
            )}
          </Modal.Container>

          <TipPortal closing={!opened} scope="intent-preview">
            {({ onClose }) => (
              <Tip
                title="Pro tip"
                description={
                  <>
                    Only intents that are used in your agent will be seen in the results from intent previews.{' '}
                    <Link style={{ display: 'inline-block' }} href={INTENT_PREVIEW_TIP_LEARN_LINK} label="Learn" target="_blank" />
                  </>
                }
              >
                <Tip.Button variant="secondary" label="Don’t show this again" onClick={onClose} />
              </Tip>
            )}
          </TipPortal>
        </>
      );
    },
  { scope: ModalScope.PROJECT }
);
