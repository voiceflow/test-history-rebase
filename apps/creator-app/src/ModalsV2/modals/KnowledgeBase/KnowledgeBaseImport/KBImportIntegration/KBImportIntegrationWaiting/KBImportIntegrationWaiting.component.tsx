import { Box, LoadingSpinner, Text, toast } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import { IKBImportIntegrationWaiting } from './KBImportIntegrationWaiting.interface';

export const KBImportIntegrationWaiting: React.FC<IKBImportIntegrationWaiting> = ({ onContinue, onClose, disabled }) => {
  const onConnected = () => {
    onContinue();
    toast.success('Connected to Zendesk');
  };

  React.useEffect(() => {
    setTimeout(onConnected, 5000);
  }, []);

  return (
    <>
      <Modal.Header title="Import from Zendesk" onClose={onClose} />

      <Box height="150px" direction="column" justify="center" align="center" gap={8}>
        <LoadingSpinner />
        <Text>Awaiting authorization...</Text>
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} />
      </Modal.Footer>
    </>
  );
};
