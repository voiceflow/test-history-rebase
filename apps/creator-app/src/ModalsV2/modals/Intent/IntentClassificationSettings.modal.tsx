import { DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS, DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS, IntentClassificationType } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Divider, notify, RadioGroup, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { IntentClassificationLLMSettings } from '@/components/Intent/IntentClassificationLLMSettings/IntentClassificationLLMSettings.component';
import { IntentClassificationNLUSettings } from '@/components/Intent/IntentClassificationNLUSettings/IntentClassificationNLUSettings.component';
import { Modal } from '@/components/Modal';
import { PopperConfirm } from '@/components/Popper/PopperConfirm/PopperConfirm.component';
import { Version } from '@/ducks';
import { useDefaultAIModel } from '@/hooks/ai.hook';
import { useLinkedState } from '@/hooks/state.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { modalsManager } from '../../manager';

export const IntentClassificationSettingsModal = modalsManager.create(
  'IntentClassificationSettingsModal',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const TEST_ID = 'intent-classification-settings-modal';

      const defaultAIModel = useDefaultAIModel();

      const storeSetting = useSelector(Version.selectors.active.intentClassificationSettings);

      const [settings, setSettings] = useLinkedState(storeSetting);

      const updateSettings = useDispatch(Version.effect.updateSettings);

      const getDefaultSettings = (type: IntentClassificationType) => {
        if (type === IntentClassificationType.NLU) {
          return DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS;
        }

        return {
          ...DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS,
          params: { ...DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS.params, model: defaultAIModel },
        };
      };

      const onClassificationTypeChange = (type: IntentClassificationType) => {
        setSettings(getDefaultSettings(type));
      };

      const onResetToDefault = async () => {
        api.preventClose();

        try {
          await updateSettings({ intentClassification: getDefaultSettings(settings.type) });

          notify.short.success('Restored to default');
        } catch {
          notify.short.error('Unable to restore Intent classification settings');
        } finally {
          api.enableClose();
        }
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
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
        >
          <Modal.Header title="Intent classification settings" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

          <Scroll style={{ display: 'block' }}>
            <Box px={24} py={20} direction="column">
              <RadioGroup
                label="Classify intention using..."
                value={settings.type}
                layout="vertical"
                options={[
                  { id: IntentClassificationType.NLU, value: IntentClassificationType.NLU, label: 'Large language models (LLM)' },
                  { id: IntentClassificationType.LLM, value: IntentClassificationType.LLM, label: 'Natural language understanding (NLU)' },
                ]}
                disabled={closePrevented}
                onValueChange={onClassificationTypeChange}
              />
            </Box>

            <Box pl={24} pb={12} direction="column">
              <Divider noPadding />
            </Box>

            {settings.type === IntentClassificationType.LLM ? (
              <IntentClassificationLLMSettings
                settings={settings}
                disabled={closePrevented}
                onSettingsChange={(value) => setSettings({ ...settings, ...value })}
                initialPromptWrapper={storeSetting.type === IntentClassificationType.LLM ? storeSetting.promptWrapper : null}
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
            <PopperConfirm
              testID={tid(TEST_ID, 'reset')}
              onConfirm={onResetToDefault}
              referenceElement={({ ref, onToggle, isOpen }) => (
                // TODO: remove div when Modal.Footer.Button supports ref
                <div ref={ref}>
                  <Modal.Footer.Button
                    label="Reset to default"
                    testID={tid(TEST_ID, 'reset-to-default')}
                    variant="secondary"
                    onClick={onToggle}
                    isActive={isOpen}
                    disabled={closePrevented}
                  />
                </div>
              )}
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
    }
);
