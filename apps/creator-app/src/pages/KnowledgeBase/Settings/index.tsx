import { BaseModels } from '@voiceflow/base-types';
import { Box, Button, Modal, Spinner, toast, useAsyncMountUnmount } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import manager from '@/ModalsV2/manager';

import Content from './content';

const KnowledgeBaseSettings = manager.create('KnowledgeBaseSettings', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const [loading, setLoading] = React.useState(true);

  const [settings, setSettings] = React.useState<BaseModels.Project.KnowledgeBaseSettings | null>(null);

  useAsyncMountUnmount(async () => {
    const { data } = await client.apiV3.fetch
      .get<BaseModels.Project.KnowledgeBaseSettings>(`/projects/${projectID}/knowledge-base/settings`)
      .catch(() => {
        toast.error('Unable to fetch Knowledge Base settings');
        return { data: null };
      });

    setSettings(data);
    setLoading(false);
  });

  const save = async () => {
    setLoading(true);

    await client.apiV3.fetch.patch<BaseModels.Project.KnowledgeBaseSettings>(`/projects/${projectID}/knowledge-base/settings`, settings).catch(() => {
      toast.error('Unable to save Knowledge Base settings');
    });

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
