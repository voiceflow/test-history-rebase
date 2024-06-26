import type { KnowledgeBaseSettings } from '@voiceflow/dtos';
import { KB_SETTINGS_DEFAULT } from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Box, notify, Scroll } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { AIMaxTokensSliderSection } from '@/components/AI/AIMaxTokensSliderSection/AIMaxTokensSliderSection.component';
import { AIModelSelectSection } from '@/components/AI/AIModelSelectSection/AIModelSelectSection.component';
import { AITemperatureSliderSection } from '@/components/AI/AITemperatureSliderSection/AITemperatureSlider.component';
import { KBChunkLimitSliderSection } from '@/components/KB/KBChunkLimitSliderSection/KBChunkLimitSliderSection.component';
import { KBSystemInputSection } from '@/components/KB/KBSystemInputSection/KBSystemInputSection.component';
import { Modal } from '@/components/Modal';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import manager from '../../manager';

export const KnowledgeBaseSettingsModal = manager.create(
  'KnowledgeBaseSettingsModel',
  () =>
    ({ api, type, opened, hidden, closePrevented, animated }) => {
      const SETTINGS_TEST_ID = tid('knowledge-base', 'settings');

      const storeSettings = useSelector(Designer.KnowledgeBase.Settings.selectors.root);

      const patchSettings = useDispatch(Designer.KnowledgeBase.Settings.effect.patch);

      const [settings, setSettings] = useState(storeSettings);

      const [trackingEvents] = useTrackingEvents();

      const onPatch = <K extends keyof KnowledgeBaseSettings>(key: K, patch: Partial<KnowledgeBaseSettings[K]>) => {
        setSettings((prev) => prev && { ...prev, [key]: { ...prev[key], ...patch } });
      };

      const onSubmit = async () => {
        try {
          api.preventClose();

          await patchSettings(settings);

          const { model } = settings.summarization;

          if (settings.summarization.temperature !== storeSettings?.summarization.temperature) {
            trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'Temperature', LLM_Updated: model });
          }

          if (settings.summarization.maxTokens !== storeSettings?.summarization.maxTokens) {
            trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'Max Tokens', LLM_Updated: model });
          }

          if (settings.summarization.model !== storeSettings?.summarization.model) {
            trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'LLM', LLM_Updated: model });
          }

          if (settings.summarization.system !== storeSettings?.summarization.system) {
            trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'Persona', LLM_Updated: model });
          }

          notify.short.success('Saved');

          api.enableClose();
          api.close();
        } catch {
          notify.short.error('Unable to save Knowledge Base settings');

          api.enableClose();
        }
      };

      const onResetToDefault = async () => {
        setSettings(KB_SETTINGS_DEFAULT);

        notify.short.success('Restored to default');
      };

      const { model } = settings.summarization;

      return (
        <Modal.Container
          type={type}
          testID={SETTINGS_TEST_ID}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
        >
          <Modal.Header
            title="Knowledge base settings"
            onClose={api.onClose}
            testID={tid(SETTINGS_TEST_ID, 'header')}
          />

          <Scroll style={{ display: 'block' }}>
            <Box pt={12} pb={24} gap={12} direction="column">
              <AIModelSelectSection
                value={model}
                testID={tid(SETTINGS_TEST_ID, 'model')}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(model) => onPatch('summarization', { model })}
              />

              <AITemperatureSliderSection
                value={settings.summarization.temperature}
                testID={tid(SETTINGS_TEST_ID, 'temperature')}
                disabled={!settings}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(temperature) => onPatch('summarization', { temperature })}
              />

              <AIMaxTokensSliderSection
                model={model}
                value={settings.summarization.maxTokens ?? KB_SETTINGS_DEFAULT.summarization.maxTokens}
                testID={tid(SETTINGS_TEST_ID, 'tokens')}
                disabled={!settings}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(maxTokens) => onPatch('summarization', { maxTokens })}
              />

              <KBChunkLimitSliderSection
                value={settings.search.limit}
                testID={tid(SETTINGS_TEST_ID, 'chunk-limit')}
                disabled={!settings}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(limit) => onPatch('search', { limit })}
              />

              {AI_MODEL_CONFIG_MAP[model].hasSystemPrompt && (
                <KBSystemInputSection
                  value={settings.summarization.system}
                  testID={tid(SETTINGS_TEST_ID, 'system-prompt')}
                  disabled={!settings}
                  learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                  onValueChange={(system) => onPatch('summarization', { system })}
                />
              )}
            </Box>
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button
              label="Reset to default"
              testID={tid(SETTINGS_TEST_ID, 'reset')}
              variant="secondary"
              onClick={onResetToDefault}
              disabled={closePrevented}
            />

            <Modal.Footer.Button
              label="Save"
              testID={tid(SETTINGS_TEST_ID, 'save')}
              variant="primary"
              onClick={onSubmit}
              disabled={!settings || closePrevented}
              isLoading={closePrevented}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
