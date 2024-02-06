import { Box, LoadingSpinner, notify, Scroll, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import { IKBImportIntegrationWaiting } from './KBImportIntegrationWaiting.interface';

const { colors } = Tokens;

export const KBImportIntegrationWaiting: React.FC<IKBImportIntegrationWaiting> = ({ onContinue, onClose, disabled }) => {
  const onConnected = () => {
    onContinue();
    notify.short.success('Connected to Zendesk');
  };

  React.useEffect(() => {
    setTimeout(onConnected, 5000);
  }, []);

  return (
    <>
      <Modal.Header title="Import from Zendesk" onClose={onClose} leftButton={<Modal.Header.Icon iconName="Zendesk" />} />

      <Scroll style={{ display: 'block' }}>
        <Box height="150px" direction="column" justify="center" align="center" gap={12}>
          <LoadingSpinner size="large" />
          <Text color={colors.neutralDark.neutralsDark900}>Awaiting authorization...</Text>
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} />
      </Modal.Footer>
    </>
  );
};
