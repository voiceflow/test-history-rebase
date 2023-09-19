import { BaseModels } from '@voiceflow/base-types';
import { Box, Button, Modal, Spinner, useAsyncMountUnmount } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import _isEqual from 'lodash/isEqual';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents } from '@/hooks';
import manager from '@/ModalsV2/manager';

import Content from './content';

const KnowledgeBaseSettings = manager.create('KnowledgeBaseSettings', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const [trackingEvents] = useTrackingEvents();
  const projectID = useSelector(Session.activeProjectIDSelector);
  const [loading, setLoading] = React.useState(true);

  const [initialSettings, setInitialSettings] = React.useState<BaseModels.Project.KnowledgeBaseSettings | null>(null);
  const [settings, setSettings] = React.useState<BaseModels.Project.KnowledgeBaseSettings | null>(null);

  useAsyncMountUnmount(async () => {
    const { data } = await client.apiV3.fetch
      .get<BaseModels.Project.KnowledgeBaseSettings>(`/projects/${projectID}/knowledge-base/settings`)
      .catch(() => {
        toast.error('Unable to fetch Knowledge Base settings');
        return { data: null };
      });

    setInitialSettings(data);
    setSettings(data);
    setLoading(false);
  });

  const save = async () => {
    setLoading(true);

    await client.apiV3.fetch.patch<BaseModels.Project.KnowledgeBaseSettings>(`/projects/${projectID}/knowledge-base/settings`, settings).catch(() => {
      toast.error('Unable to save Knowledge Base settings');
    });

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

    toast.success('Knowledge Base settings saved');

    api.close();
  };

  if (loading || !settings)
    return (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
        <Box py={128}>
          <Spinner borderLess />
        </Box>
      </Modal>
    );

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
        Knowledge Base Settings
      </Modal.Header>
      <Content settings={settings} setSettings={setSettings} />

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>

        <Button onClick={save} disabled={closePrevented} squareRadius>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default KnowledgeBaseSettings;
