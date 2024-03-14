import { Nullable, Utils } from '@voiceflow/common';
import { IntentClassificationType } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, notify, Section, Text, TextArea, Tokens } from '@voiceflow/ui-next';
import { validatorFactory } from '@voiceflow/utils-designer';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

import { Modal } from '@/components/Modal';
import { PreviewResultFooter } from '@/components/Preview/PreviewResultFooter/PreviewResultFooter.component';
import { Version } from '@/ducks';
import { useInput, useInputState } from '@/hooks/input.hook';
import { useSessionStorageState } from '@/hooks/storage.hook';
import { useSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import { preventDefault, withEnterPress, withInputBlur } from '@/utils/handler.util';

import { modalsManager } from '../../../manager';
import { ClassifiedIntent } from './IntentPreview.interface';
import { IntentPreviewFeedback } from './IntentPreviewFeedback.component';

export const IntentPreviewModal = modalsManager.create('IntentPreviewModal', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const MODAL_ID = 'preview-intent-modal';

  const intentClassificationSettings = useSelector(Version.selectors.active.intentClassificationSettings);

  const utteranceState = useInputState();
  const [classifyStatus, setClassifyStatus] = useState<'success' | 'error'>('success');
  const [classifyLatency, setClassifyLatency] = useState(0);
  const [classifiedIntents, setClassifiedIntents] = useState<Nullable<{ nlu: ClassifiedIntent[]; llm: ClassifiedIntent[] }>>(null);
  const [lastUsedUtterance, setLastUsedUtterance] = useSessionStorageState(`${MODAL_ID}-last-used-utterance`, '');

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
      // TODO: replace with real classification
      await Utils.promise.delay(2000);

      utteranceInput.setValue('');
      setLastUsedUtterance(utterance);

      setClassifyStatus('success');
      setClassifiedIntents({
        nlu: [
          { name: 'intent1', confidence: 0.8 },
          { name: 'intent2', confidence: 0.2 },
        ],
        llm: [],
      });

      flushSync(() => api.enableClose());

      utteranceInput.ref.current?.focus();
    } catch {
      api.enableClose();

      setClassifyStatus('error');
      notify.short.error('Classification failed');
    }

    setClassifyLatency(Date.now() - now);
  });

  const onSubmit = () => onSend({ utterance: utteranceInput.value });
  const onReuseLastUtterance = () => utteranceInput.setValue(lastUsedUtterance);

  const isLLMClassification = intentClassificationSettings.type === IntentClassificationType.LLM;

  return (
    <Modal.Container
      type={type}
      testID={MODAL_ID}
      opened={opened}
      hidden={hidden}
      stacked
      animated={animated}
      onExited={api.remove}
      onEscClose={api.onEscClose}
      onEnterSubmit={onSubmit}
    >
      <>
        <Modal.Header title="Intent preview" onClose={api.onClose} testID={tid(MODAL_ID, 'header')} />

        <Modal.Body>
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

          <Modal.Footer.Button
            label="Send"
            testID={tid(MODAL_ID, 'send')}
            variant="primary"
            onClick={onSubmit}
            disabled={closePrevented}
            isLoading={closePrevented}
          />
        </Modal.Footer>
      </>

      {!!classifiedIntents && (
        <Box pt={5} direction="column">
          {isLLMClassification && (
            <>
              <Section.Header.Container title="LLM classification" variant="active">
                <IntentPreviewFeedback key={lastUsedUtterance} />
              </Section.Header.Container>
            </>
          )}

          <Section.Header.Container
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
            {!isLLMClassification && <IntentPreviewFeedback key={lastUsedUtterance} />}
          </Section.Header.Container>

          <PreviewResultFooter status={classifyStatus} latency={classifyLatency} />
        </Box>
      )}
    </Modal.Container>
  );
});
