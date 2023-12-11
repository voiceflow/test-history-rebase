import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { AIGPTModel } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Popper, Text, toast } from '@voiceflow/ui-next';
import _isEqual from 'lodash/isEqual';
import React from 'react';

import client from '@/client';
import { Modal } from '@/components/Modal';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../../manager';
import { ChunkLimitSlider, ModelSelect, SystemPrompt, TemperatureSlider, TokensSlider } from './components';
import { SYSTEM_PROMPT_MODELS } from './Settings.constant';
import { confirmBoxStyles } from './Settings.css';

export interface Props {
  initialSettings: BaseModels.Project.KnowledgeBaseSettings | null;
}

export const Settings = manager.create<Props>('KBSettings', () => ({ api, type, opened, hidden, closePrevented, animated, initialSettings }) => {
  const [trackingEvents] = useTrackingEvents();
  const projectID = useSelector(Session.activeProjectIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const [settings, setSettings] = React.useState<BaseModels.Project.KnowledgeBaseSettings | null>(initialSettings);

  const getIsFeatureEnabled = useSelector(Feature.isFeatureEnabledSelector);

  const update = React.useCallback(
    <T extends keyof BaseModels.Project.KnowledgeBaseSettings>(property: T) =>
      (data: Partial<BaseModels.Project.KnowledgeBaseSettings[T]>) => {
        setSettings((settings) => (settings ? { ...settings, [property]: { ...settings[property], ...data } } : null));
      },
    []
  );

  const save = async () => {
    api.preventClose();

    if (getIsFeatureEnabled(Realtime.FeatureFlag.VERSIONED_KB_SETTINGS)) {
      await client.api.fetch.patch<BaseModels.Project.KnowledgeBaseSettings>(`/versions/${versionID}/knowledge-base/settings`, settings).catch(() => {
        toast.error('Unable to save Knowledge Base settings');
      });
    } else {
      await client.apiV3.fetch
        .patch<BaseModels.Project.KnowledgeBaseSettings>(`/projects/${projectID}/knowledge-base/settings`, settings)
        .catch(() => {
          toast.error('Unable to save Knowledge Base settings');
        });
    }

    const model = initialSettings?.summarization.model ?? settings?.summarization.model;

    if (!_isEqual(settings, initialSettings) && model) {
      const summarization = settings?.summarization;
      const oldSummarization = initialSettings?.summarization;

      if (summarization?.temperature !== oldSummarization?.temperature) {
        trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'Temperature', LLM_Updated: model });
      }

      if (summarization?.maxTokens !== oldSummarization?.maxTokens) {
        trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'Max Tokens', LLM_Updated: model });
      }

      if (summarization?.model !== oldSummarization?.model) {
        trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'LLM', LLM_Updated: model });
      }

      if (summarization?.system !== oldSummarization?.system) {
        trackingEvents.trackAiKnowledgeBaseSettingsModified({ Mod_Type: 'Persona', LLM_Updated: model });
      }
    }
    api.enableClose();
    api.close();
    toast.success('Saved');
  };

  const resetToDefault = () => {
    update('summarization')({ model: AIGPTModel.GPT_3_5_turbo as BaseUtils.ai.GPT_MODEL, temperature: 0.7, maxTokens: 128, system: '' });
    update('search')({ limit: 2 });
    toast.success('Restored to default');
  };

  return (
    <Modal.Container
      type={type}
      opened={opened}
      hidden={hidden}
      animated={animated}
      onExited={api.remove}
      onEscClose={api.close}
      onEnterSubmit={save}
    >
      <Modal.Header title="Knowledge base settings" onClose={api.close} />

      <Box pt={12} px={24} pb={24} direction="column">
        <ModelSelect model={settings?.summarization.model} onChange={update('summarization')} />
        <TemperatureSlider temperature={settings?.summarization.temperature} onChange={update('summarization')} />
        <TokensSlider tokens={settings?.summarization.maxTokens} onChange={update('summarization')} />
        <ChunkLimitSlider chunkLimit={settings?.search.limit} onChange={update('search')} />
        {SYSTEM_PROMPT_MODELS.has(settings?.summarization.model || AIGPTModel.GPT_3_5_turbo) && (
          <SystemPrompt system={settings?.summarization.system} onChange={update('summarization')} />
        )}
      </Box>

      <Modal.Footer>
        <Popper
          placement="bottom-start"
          referenceElement={({ onToggle, ref }) => (
            <div ref={ref}>
              <Modal.Footer.Button variant="secondary" onClick={onToggle} disabled={closePrevented} label="Reset to Default" />
            </div>
          )}
        >
          {({ onToggle }) => (
            <Box className={confirmBoxStyles} direction="column" gap={10}>
              <Text>This action can’t be undone, please confirm you’d like to continue.</Text>
              <Box justify="space-between" gap={8}>
                <Button label="No" fullWidth variant="secondary" onClick={onToggle} disabled={closePrevented} />
                <Button
                  label="Yes"
                  fullWidth
                  variant="primary"
                  onClick={Utils.functional.chain(resetToDefault, onToggle)}
                  disabled={closePrevented}
                />
              </Box>
            </Box>
          )}
        </Popper>

        <Modal.Footer.Button label="Save" variant="primary" onClick={save} disabled={closePrevented} />
      </Modal.Footer>
    </Modal.Container>
  );
});
