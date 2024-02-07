import { BaseModels } from '@voiceflow/base-types';
import { Box, LoadingSpinner, notify, Scroll, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { KnowledgeBaseIntegration } from '@/models/KnowledgeBase.model';
import { openURLInANewPopupWindow } from '@/utils/window';

import { IKBImportIntegrationWaiting } from './KBImportIntegrationWaiting.interface';

const { colors } = Tokens;

export const KBImportIntegrationWaiting: React.FC<IKBImportIntegrationWaiting> = ({ onContinue, onFail, onClose, disabled, reconnect = false }) => {
  const getAuthUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthUrl);
  const getAuthReconnectUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthReconnectUrl);

  const [popupWindow, setPopupWindow] = React.useState<Window | null>(null);

  const getAll = useDispatch(Designer.KnowledgeBase.Integration.effect.getAll);

  const onConnectZendesk = async () => {
    const authUrl = reconnect
      ? await getAuthReconnectUrl(BaseModels.Project.IntegrationTypes.ZENDESK)
      : await getAuthUrl(BaseModels.Project.IntegrationTypes.ZENDESK);

    const popup = openURLInANewPopupWindow(authUrl);
    setPopupWindow(popup);

    setTimeout(() => onConnected(false), 300000);
  };

  const onConnected = (success?: boolean) => {
    popupWindow?.close();
    if (success) onContinue();
    else onFail();
  };

  React.useEffect(() => {
    if (!popupWindow) return;

    let integrations: KnowledgeBaseIntegration[] = [];

    const checkPopup = setInterval(async () => {
      const today = new Date();
      const integrationCreatedAt = integrations.find((item) => item.type === BaseModels.Project.IntegrationTypes.ZENDESK)?.createdAt;

      const timeDiff = integrationCreatedAt ? today.getTime() - new Date(integrationCreatedAt).getTime() : null;
      // eslint-disable-next-line no-console
      console.log(`timeDifference: ${timeDiff}`);

      const createdWithFiveMinutes = timeDiff ? timeDiff > 5 * 60 * 1000 : false;
      // eslint-disable-next-line no-console
      console.log('createdWIthinFiveMinutes');
      // eslint-disable-next-line no-console
      console.log(createdWithFiveMinutes);

      if (createdWithFiveMinutes) {
        clearInterval(checkPopup);
        onConnected(true);
        notify.short.success('Connected to Zendesk');
      } else if (!popupWindow || !popupWindow.closed) {
        // eslint-disable-next-line no-console
        console.log('refetching integrations');
        integrations = await getAll();
        return;
      }
      clearInterval(checkPopup);
    }, 2000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(checkPopup);
    };
  }, [popupWindow]);

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
