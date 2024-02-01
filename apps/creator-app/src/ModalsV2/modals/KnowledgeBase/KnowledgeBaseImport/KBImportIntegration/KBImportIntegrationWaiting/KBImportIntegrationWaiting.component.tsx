import { Box, LoadingSpinner, notify, Scroll, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { openURLInANewTab } from '@/utils/window';

import { IKBImportIntegrationWaiting } from './KBImportIntegrationWaiting.interface';

const { colors } = Tokens;

export const KBImportIntegrationWaiting: React.FC<IKBImportIntegrationWaiting> = ({ onContinue, onClose, disabled }) => {
  const getAuthUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthUrl);

  const onConnectZendesk = async () => {
    const authUrl = await getAuthUrl('zendesk');
    openURLInANewTab(authUrl);
  };

  const onConnected = () => {
    onContinue();
    notify.short.success('Connected to Zendesk');
  };

  React.useEffect(() => {
    onConnectZendesk();
    setTimeout(onConnected, 5000);
  }, [getAuthUrl]);

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
