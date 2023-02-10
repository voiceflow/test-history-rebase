import { Box, Button, Link, Modal, useSetup } from '@voiceflow/ui';
import React from 'react';

import { takeoffGraphic } from '@/assets';

import manager from '../manager';

const CHANGELOG_LINK = 'https://www.notion.so/voiceflow/Voiceflow-Changelog-b5e32e269b204106b5b51014cd049346';

interface RefreshProps {
  version: number | string;
}

const Refresh = manager.create<RefreshProps>('Refresh', () => ({ api, type, opened, hidden, version, animated }) => {
  const onRefresh = () => {
    window.location.assign(`${window.location.origin}${window.location.pathname}?v=${version}`);
  };

  useSetup(() => {
    // prerender the next version
    window.document.head.insertAdjacentHTML(
      'beforeend',
      `<link rel="prerender" href="${window.location.origin}${window.location.pathname}?v=${version}" />`
    );
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={392}>
      <Modal.Header>New Version</Modal.Header>

      <Modal.Body centred>
        <img src={takeoffGraphic} alt="new version" height={80} />

        <Box mt={16}>Voiceflow has published new changes. Please refresh to gain access to the newest version.</Box>
      </Modal.Body>

      <Modal.Footer justifyContent="space-between">
        <Link href={CHANGELOG_LINK}>See what’s new!</Link>
        <Button onClick={onRefresh}>Refresh</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Refresh;
