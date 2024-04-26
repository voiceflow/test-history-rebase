import { IntentClassificationType } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Divider, notify, RadioGroup, Scroll } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { IntentClassificationLLMSettings } from '@/components/Intent/IntentClassificationLLMSettings/IntentClassificationLLMSettings.component';
import { IntentClassificationNLUSettings } from '@/components/Intent/IntentClassificationNLUSettings/IntentClassificationNLUSettings.component';
import { Modal } from '@/components/Modal';
import { RadioGroupLabelWithTooltip } from '@/components/RadioGroup/RadioGroupLabelWithTooltip/RadioGroupLabelWithTooltip.component';
import { LLM_INTENT_CLASSIFICATION_LEARN_MORE, NLU_INTENT_CLASSIFICATION_LEARN_MORE } from '@/constants/link.constant';
import { Version } from '@/ducks';
import { useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useIntentClassificationSettings, useIntentGetDefaultClassificationSettings } from '@/hooks/intent.hook';
import { useLinkedState } from '@/hooks/state.hook';
import { useDispatch } from '@/hooks/store.hook';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { modalsManager } from '../../manager';

export const IntentClassificationSettingsModal = modalsManager.create(
  'IntentClassificationSettingsModal',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const TEST_ID = 'intent-classification-settings-modal';

      const storeSetting = useIntentClassificationSettings();
      const aiFeaturesEnabled = useIsAIFeaturesEnabled();
      const getDefaultSettings = useIntentGetDefaultClassificationSettings();

      const [settings, setSettings] = useLinkedState(storeSetting);
      const [codeEditorOpened, setCodeEditorOpened] = useState(false);

      const updateSettings = useDispatch(Version.effect.updateSettings);

      const onClassificationTypeChange = (type: IntentClassificationType) => {
        setSettings(getDefaultSettings(type));
      };

      const onResetToDefault = () => {
        setSettings(getDefaultSettings(settings.type));

        notify.short.success('Restored to default');
      };

      const onSubmit = async () => {
        api.preventClose();

        try {
          await updateSettings({ intentClassification: settings });

          notify.short.success('Saved');

          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
          notify.short.error('Unable to save Intent classification settings');
        }
      };

      return (
        <Modal.Container
          type={type}
          testID={TEST_ID}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={codeEditorOpened ? undefined : api.onEscClose}
          onEnterSubmit={onSubmit}
        >
          <Modal.Header title="Intent classification settings" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

          <Scroll pt={12} style={{ display: 'block' }}>
            {aiFeaturesEnabled && (
              <>
                <Box px={24} pt={8} pb={20} direction="column">
                  <RadioGroup
                    label="Classify intention using..."
                    value={settings.type}
                    layout="vertical"
                    options={[
                      {
                        id: IntentClassificationType.LLM,
                        value: IntentClassificationType.LLM,
                        label: (
                          <RadioGroupLabelWithTooltip
                            width={200}
                            label="Large language model (LLM)"
                            onLearnClick={onOpenURLInANewTabFactory(LLM_INTENT_CLASSIFICATION_LEARN_MORE)}
                          >
                            Use large language models to classify users intentions and select which intent to trigger.
                          </RadioGroupLabelWithTooltip>
                        ) as any,
                      },
                      {
                        id: IntentClassificationType.NLU,
                        value: IntentClassificationType.NLU,
                        label: (
                          <RadioGroupLabelWithTooltip
                            width={205}
                            label="Natural language understanding (NLU)"
                            onLearnClick={onOpenURLInANewTabFactory(NLU_INTENT_CLASSIFICATION_LEARN_MORE)}
                          >
                            Use Voiceflow’s natural language understanding model to classify users intentions and select
                            which intent to trigger.
                          </RadioGroupLabelWithTooltip>
                        ) as any,
                      },
                    ]}
                    disabled={closePrevented}
                    onValueChange={onClassificationTypeChange}
                  />
                </Box>

                <Box pl={24} pb={12} direction="column">
                  <Divider noPadding />
                </Box>
              </>
            )}

            {settings.type === IntentClassificationType.LLM ? (
              <IntentClassificationLLMSettings
                settings={settings}
                disabled={closePrevented}
                onSettingsChange={(value) => setSettings({ ...settings, ...value })}
                onCodeEditorToggle={setCodeEditorOpened}
              />
            ) : (
              <IntentClassificationNLUSettings
                settings={settings}
                disabled={closePrevented}
                onSettingsChange={(value) => setSettings({ ...settings, ...value })}
              />
            )}
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button
              label="Reset to default"
              testID={tid(TEST_ID, 'reset-to-default')}
              variant="secondary"
              onClick={onResetToDefault}
              disabled={closePrevented}
            />

            <Modal.Footer.Button
              label="Save"
              testID={tid(TEST_ID, 'save')}
              variant="primary"
              onClick={onSubmit}
              disabled={closePrevented}
              isLoading={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
