import { Box, Button, Modal } from '@voiceflow/ui';
import React from 'react';

import { projectDownloadGraphic } from '@/assets';
import { usePaymentModal } from '@/hooks/modal.hook';

import manager from '../../manager';

const Download = manager.create('ProjectDownload', () => ({ api, type, opened, hidden, animated }) => {
  const paymentModal = usePaymentModal();

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    api.close();
  };

  const onUnlock = (e: React.MouseEvent) => {
    paymentModal.open({});
    onToggle(e);
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
      <Modal.Header>Assistant Download</Modal.Header>

      <Modal.Body centered>
        <Box.FlexCenter>
          <img src={projectDownloadGraphic} alt="plan restriction" height={80} />
        </Box.FlexCenter>

        <Box mt={16}>
          This is a <b>Pro</b> feature. Please upgrade your workspace to access downloadable link.
        </Box>
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button squareRadius onClick={onUnlock}>
          Unlock
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Download;
