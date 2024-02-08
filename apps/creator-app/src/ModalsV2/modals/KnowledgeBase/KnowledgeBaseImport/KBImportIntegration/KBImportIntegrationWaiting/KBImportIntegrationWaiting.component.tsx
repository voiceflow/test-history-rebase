import { BaseModels } from '@voiceflow/base-types';
import { Box, LoadingSpinner, notify, Scroll, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { ZENDESK_CALLBACK_CHANNEL } from '@/constants';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { openURLInANewPopupWindow } from '@/utils/window';

import { IKBImportIntegrationWaiting } from './KBImportIntegrationWaiting.interface';

const { colors } = Tokens;

export const KBImportIntegrationWaiting: React.FC<IKBImportIntegrationWaiting> = ({
  onFail,
  onClose,
  disabled,
  reconnect = false,
  subdomain,
  onContinue,
}) => {
  const getAuthUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthUrl);
  const getAuthReconnectUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthReconnectUrl);
  const [trackingEvents] = useTrackingEvents();

  const [popupWindow, setPopupWindow] = React.useState<Window | null>(null);
  const [timeout, setTimeoutObject] = React.useState<NodeJS.Timeout | null>(null);

  const onConnectZendesk = async () => {
    try {
      const authUrl = reconnect
        ? await getAuthReconnectUrl(BaseModels.Project.IntegrationTypes.ZENDESK)
        : await getAuthUrl(BaseModels.Project.IntegrationTypes.ZENDESK, { subdomain });

      const popup = openURLInANewPopupWindow(authUrl);

      setPopupWindow(popup);

      const closeTimeout = setTimeout(() => onConnected(false), 300000);
      setTimeoutObject(closeTimeout);
    } catch {
      trackingEvents.trackAiKnowledgeBaseIntegrationFailed({ IntegrationType: 'zendesk' });
      notify.short.error('Failed to connect to Zendesk. Please try again.');
      onFail();
    }
  };

  const onConnected = (success?: boolean) => {
    popupWindow?.close();

    if (success) {
      trackingEvents.trackAiKnowledgeBaseIntegrationConnected({ IntegrationType: 'zendesk' });
      onContinue();
    } else {
      trackingEvents.trackAiKnowledgeBaseIntegrationFailed({ IntegrationType: 'zendesk' });
      notify.short.error('Failed to connect to Zendesk. Please try again.');
      onFail();
    }
  };

  React.useEffect(() => {
    setTimeout(onConnected, 5000);
    const bc = new BroadcastChannel(ZENDESK_CALLBACK_CHANNEL);

    bc.onmessage = (event) => {
      // eslint-disable-next-line no-console
      console.log(event.data);
      if (event.data === 'success') {
        onConnected(true);
        notify.short.success('Connected to Zendesk');
      } else if (event.data === 'fail') {
        onConnected(false);
      }
      bc.close();
    };

    return () => {
      if (timeout) clearTimeout(timeout);
      bc.close();
    };
  }, []);

  React.useEffect(() => {
    onConnectZendesk();
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
