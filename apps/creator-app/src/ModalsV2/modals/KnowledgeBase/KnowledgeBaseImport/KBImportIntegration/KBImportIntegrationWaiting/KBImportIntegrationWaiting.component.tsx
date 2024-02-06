import { BaseModels } from '@voiceflow/base-types';
import { Box, LoadingSpinner, notify, Scroll, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { openURLInANewPopupWindow } from '@/utils/window';

import { IKBImportIntegrationWaiting } from './KBImportIntegrationWaiting.interface';

const { colors } = Tokens;

export const KBImportIntegrationWaiting: React.FC<IKBImportIntegrationWaiting> = ({ onContinue, onFail, onClose, disabled, reconnect = false }) => {
  const getAuthUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthUrl);
  const getAuthReconnectUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthReconnectUrl);

  const [popupWindow, setPopupWindow] = React.useState<Window | null>(null);

  const integrations = useSelector(Designer.KnowledgeBase.Integration.selectors.all);
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

    const checkPopup = setInterval(() => {
      const today = new Date();
      const integrationCreatedAt = integrations.find((item) => item.type === BaseModels.Project.IntegrationTypes.ZENDESK)?.createdAt;

      const createdWithFiveMinutes = integrationCreatedAt ? today.getTime() - new Date(integrationCreatedAt).getTime() > 5 * 60 * 1000 : false;

      if (createdWithFiveMinutes) {
        clearInterval(checkPopup);
        onConnected(true);
        notify.short.success('Connected to Zendesk');
      } else if (!popupWindow || !popupWindow.closed) return;
      else {
        getAll();
      }
      clearInterval(checkPopup);
    }, 2000);
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
