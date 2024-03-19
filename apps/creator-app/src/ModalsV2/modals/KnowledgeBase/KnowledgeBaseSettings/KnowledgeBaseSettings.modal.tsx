import { BaseModels, BaseUtils } from '@voiceflow/base-types';
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
import { useAsyncEffect } from '@/hooks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import manager from '../../../manager';
import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { DEFAULT_SETTINGS } from './KnowledgeBaseSettings.constant';

export const KnowledgeBaseSettings = manager.create('KnowledgeBaseSettingsV2', () => ({ api, type, opened, hidden, closePrevented, animated }) => {
  const storeSettings = useSelector(Designer.KnowledgeBase.selectors.settings);

  const getSettings = useDispatch(Designer.KnowledgeBase.effect.getSettings);
  const patchSettings = useDispatch(Designer.KnowledgeBase.effect.patchSettings);

  const [settings, setSettings] = useState(storeSettings);

  const [trackingEvents] = useTrackingEvents();

  const onPatch = <K extends keyof BaseModels.Project.KnowledgeBaseSettings>(key: K, patch: Partial<BaseModels.Project.KnowledgeBaseSettings[K]>) => {
    setSettings((prev) => prev && { ...prev, [key]: { ...prev[key], ...patch } });
  };

  const onSubmit = async () => {
    if (!settings) return;

    try {
      api.preventClose();

      await patchSettings(settings);

      const model = settings.summarization.model ?? DEFAULT_SETTINGS.summarization.model;

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

      // if (settings.summarization.instruction !== storeSettings?.summarization.instruction) {
      //   trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'Instruction', LLM_Updated: model });
      // }

      notify.short.success('Saved');

      api.enableClose();
      api.close();
    } catch {
      notify.short.error('Unable to save Knowledge Base settings');

      api.enableClose();
    }
  };

  const onResetToDefault = async () => {
    setSettings(DEFAULT_SETTINGS);
  };

  useAsyncEffect(async () => {
    try {
      await getSettings();
    } catch {
      notify.short.error('Unable to fetch latest knowledge base settings');
    }
  }, []);

  api.useOnCloseRequest((source) => source !== 'backdrop');

  const model = settings?.summarization.model ?? DEFAULT_SETTINGS.summarization.model;

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
      <Modal.Header title="Knowledge base settings" onClose={api.onClose} testID={tid(SETTINGS_TEST_ID, 'header')} />

      <Scroll style={{ display: 'block' }}>
        <Box pt={12} pb={24} gap={12} direction="column">
          <AIModelSelectSection
            value={model}
            testID={tid(SETTINGS_TEST_ID, 'model')}
            disabled={!settings}
            learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
            onValueChange={(model) => onPatch('summarization', { model: model as BaseUtils.ai.GPT_MODEL })}
          />

          <AITemperatureSliderSection
            value={settings?.summarization.temperature ?? DEFAULT_SETTINGS.summarization.temperature}
            testID={tid(SETTINGS_TEST_ID, 'temperature')}
            disabled={!settings}
            learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
            onValueChange={(temperature) => onPatch('summarization', { temperature })}
          />

          <AIMaxTokensSliderSection
            model={model}
            value={settings?.summarization.maxTokens ?? DEFAULT_SETTINGS.summarization.maxTokens}
            testID={tid(SETTINGS_TEST_ID, 'tokens')}
            disabled={!settings}
            learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
            onValueChange={(maxTokens) => onPatch('summarization', { maxTokens })}
          />

          <KBChunkLimitSliderSection
            value={settings?.search.limit ?? DEFAULT_SETTINGS.search.limit}
            testID={tid(SETTINGS_TEST_ID, 'chunk-limit')}
            disabled={!settings}
            learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
            onValueChange={(limit) => onPatch('search', { limit })}
          />

          {AI_MODEL_CONFIG_MAP[model].hasSystemPrompt && (
            <KBSystemInputSection
              value={settings?.summarization.system ?? DEFAULT_SETTINGS.summarization.system}
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
});
