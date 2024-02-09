import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Box, Button, notify, Popper, Scroll, Text } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { SYSTEM_PROMPT_AI_MODELS } from '@/config/ai-model';
import { Designer } from '@/ducks';
import { useLinkedState } from '@/hooks/state.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import manager from '../../../manager';
import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { KBSettingsChunkLimit } from './KBSettingsChunkLimit.component';
// import { KBSettingsInstructions } from './KBSettingsInstructions.component';
import { KBSettingsModelSelect } from './KBSettingsModelSelect.component';
import { KBSettingsSystemPrompt } from './KBSettingsSystemPrompt.component';
import { KBSettingsTemperature } from './KBSettingsTemperature.component';
import { KBSettingsTokens } from './KBSettingsTokens.component';
import { DEFAULT_SETTINGS } from './KnowledgeBaseSettings.constant';
import { confirmBoxStyles, systemPromptStyles } from './KnowledgeBaseSettings.css';

export const KnowledgeBaseSettings = manager.create('KnowledgeBaseSettingsV2', () => ({ api, type, opened, hidden, closePrevented, animated }) => {
  const storeSettings = useSelector(Designer.KnowledgeBase.selectors.settings);

  const getSettings = useDispatch(Designer.KnowledgeBase.effect.getSettings);
  const patchSettings = useDispatch(Designer.KnowledgeBase.effect.patchSettings);

  const [settings, setSettings] = useLinkedState(storeSettings);

  const [activeTooltipLabel, setActiveTooltipLabel] = React.useState<string | null>(null);

  const [trackingEvents] = useTrackingEvents();

  const onPatch = <K extends keyof BaseModels.Project.KnowledgeBaseSettings>(key: K, patch: Partial<BaseModels.Project.KnowledgeBaseSettings[K]>) => {
    setSettings((prev) => prev && { ...prev, [key]: { ...prev[key], ...patch } });
  };

  const save = async () => {
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
    try {
      await patchSettings(DEFAULT_SETTINGS);

      notify.short.success('Restored to default');
    } catch {
      notify.short.error('Unable to restore Knowledge Base settings');
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        await getSettings();
      } catch {
        notify.short.error('Unable to fetch latest knowledge base settings');
      }
    })();
  }, []);

  const model = settings?.summarization.model ?? DEFAULT_SETTINGS.summarization.model;

  return (
    <Modal.Container
      type={type}
      opened={opened}
      hidden={hidden}
      animated={animated}
      onExited={api.remove}
      onEscClose={api.onEscClose}
      onEnterSubmit={save}
      testID={SETTINGS_TEST_ID}
    >
      <Modal.Header title="Knowledge base settings" onClose={api.onClose} testID={tid(SETTINGS_TEST_ID, 'header')} />

      <Scroll style={{ display: 'block' }}>
        <Box pt={12} pr={24} pb={24} direction="column" overflow="auto">
          <KBSettingsModelSelect
            value={model}
            disabled={!settings}
            onValueChange={(model) => onPatch('summarization', { model: model as any })}
            activeTooltipLabel={activeTooltipLabel}
            setTooltipActiveLabel={setActiveTooltipLabel}
          />

          <KBSettingsTemperature
            value={settings?.summarization.temperature ?? DEFAULT_SETTINGS.summarization.temperature}
            disabled={!settings}
            onValueChange={(temperature) => onPatch('summarization', { temperature })}
            activeTooltipLabel={activeTooltipLabel}
            setTooltipActiveLabel={setActiveTooltipLabel}
          />

          <KBSettingsTokens
            model={model}
            value={settings?.summarization.maxTokens ?? DEFAULT_SETTINGS.summarization.maxTokens}
            disabled={!settings}
            onValueChange={(maxTokens) => onPatch('summarization', { maxTokens })}
            activeTooltipLabel={activeTooltipLabel}
            setTooltipActiveLabel={setActiveTooltipLabel}
          />

          <KBSettingsChunkLimit
            value={settings?.search.limit ?? DEFAULT_SETTINGS.search.limit}
            disabled={!settings}
            onValueChange={(limit) => onPatch('search', { limit })}
            activeTooltipLabel={activeTooltipLabel}
            setTooltipActiveLabel={setActiveTooltipLabel}
          />

          {/* TODO: removed for first release, but prob should be added back in */}
          {/* <KBSettingsInstructions
          value={settings?.summarization.instruction ?? DEFAULT_SETTINGS.summarization.instruction}
          onValueChange={(instruction: string) => onPatch('summarization', { instruction })}
        /> */}

          {SYSTEM_PROMPT_AI_MODELS.has(model) && (
            <KBSettingsSystemPrompt
              value={settings?.summarization.system ?? DEFAULT_SETTINGS.summarization.system}
              disabled={!settings}
              className={systemPromptStyles}
              onValueChange={(system) => onPatch('summarization', { system })}
              activeTooltipLabel={activeTooltipLabel}
              setTooltipActiveLabel={setActiveTooltipLabel}
            />
          )}
        </Box>
      </Scroll>

      <Modal.Footer>
        <Popper
          placement="bottom-start"
          testID={tid(SETTINGS_TEST_ID, ['reset', 'confirmation'])}
          referenceElement={({ onToggle, isOpen, ref }) => (
            <div ref={ref}>
              <Modal.Footer.Button
                variant="secondary"
                onClick={onToggle}
                isActive={isOpen}
                disabled={closePrevented}
                label="Reset to default"
                testID={tid(SETTINGS_TEST_ID, 'reset')}
              />
            </div>
          )}
        >
          {({ onClose }) => (
            <Box className={confirmBoxStyles} direction="column" gap={10}>
              <Text variant="basic">This action can’t be undone, please confirm you’d like to continue.</Text>

              <Box justify="space-between" gap={8}>
                <Button
                  label="No"
                  size="medium"
                  fullWidth
                  variant="secondary"
                  onClick={onClose}
                  disabled={closePrevented}
                  testID={tid(SETTINGS_TEST_ID, ['reset', 'confirmation', 'no'])}
                />

                <Button
                  label="Yes"
                  size="medium"
                  fullWidth
                  variant="primary"
                  onClick={Utils.functional.chain(onClose, onResetToDefault)}
                  disabled={closePrevented}
                  testID={tid(SETTINGS_TEST_ID, ['reset', 'confirmation', 'yes'])}
                />
              </Box>
            </Box>
          )}
        </Popper>

        <Modal.Footer.Button
          label="Save"
          variant="primary"
          onClick={save}
          disabled={!settings || closePrevented}
          isLoading={closePrevented}
          testID={tid(SETTINGS_TEST_ID, 'save')}
        />
      </Modal.Footer>
    </Modal.Container>
  );
});
