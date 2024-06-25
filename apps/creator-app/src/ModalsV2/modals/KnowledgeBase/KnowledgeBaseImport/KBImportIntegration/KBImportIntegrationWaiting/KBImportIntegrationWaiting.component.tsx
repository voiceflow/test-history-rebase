import { BaseModels } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Box, LoadingSpinner, notify, Scroll, Text, Tokens } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useAsyncEffect } from '@/hooks';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { openURLInANewPopupWindow } from '@/utils/window';

import type { IKBImportIntegrationWaiting } from './KBImportIntegrationWaiting.interface';

const { colors } = Tokens;

export const KBImportIntegrationWaiting: React.FC<IKBImportIntegrationWaiting> = ({
  onFail,
  onClose,
  testID,
  disabled,
  reconnect = false,
  subdomain,
  onContinue,
}) => {
  const getAuthUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthUrl);
  const getAuthReconnectUrl = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationAuthReconnectUrl);
  const getAll = useDispatch(Designer.KnowledgeBase.Integration.effect.getAll);
  const [trackingEvents] = useTrackingEvents();

  const pollTimeoutRef = React.useRef<number | null>(null);
  const failTimeoutRef = React.useRef<number | null>(null);
  const popupWindowRef = React.useRef<Window | null>(null);

  useAsyncEffect(async () => {
    try {
      const authUrl = reconnect
        ? await getAuthReconnectUrl(BaseModels.Project.IntegrationTypes.ZENDESK)
        : await getAuthUrl(BaseModels.Project.IntegrationTypes.ZENDESK, { subdomain });

      const now = new Date();

      popupWindowRef.current = openURLInANewPopupWindow(authUrl);

      const failByTimeout = () => {
        trackingEvents.trackAiKnowledgeBaseIntegrationFailed({ IntegrationType: 'zendesk' });
        onFail();

        if (pollTimeoutRef.current) {
          window.clearTimeout(pollTimeoutRef.current);
        }

        try {
          popupWindowRef.current?.close();
        } catch {
          // ignore
        }
      };

      const pollIntegration = async () => {
        const integrations = await getAll();

        const zendeskIntegration = integrations.find(
          (item) => item.type === BaseModels.Project.IntegrationTypes.ZENDESK
        );

        const timeDiff = zendeskIntegration ? now.getTime() - new Date(zendeskIntegration.createdAt).getTime() : null;
        const createdRecently = timeDiff && timeDiff < 5 * 60 * 1000;

        if (createdRecently) {
          trackingEvents.trackAiKnowledgeBaseIntegrationConnected({ IntegrationType: 'zendesk' });

          onContinue();

          notify.short.success('Connected to Zendesk');

          try {
            popupWindowRef.current?.close();
          } catch {
            // ignore
          }
        } else {
          pollTimeoutRef.current = window.setTimeout(pollIntegration, 1500);
        }
      };

      // reject race timeout
      failTimeoutRef.current = window.setTimeout(failByTimeout, 300000);
      pollTimeoutRef.current = window.setTimeout(pollIntegration, 1500);
    } catch {
      trackingEvents.trackAiKnowledgeBaseIntegrationFailed({ IntegrationType: 'zendesk' });
      notify.short.error('Failed to connect to Zendesk');
      onFail();
    }
  }, []);

  useEffect(
    () => () => {
      if (pollTimeoutRef.current) {
        window.clearTimeout(pollTimeoutRef.current);
      }

      if (failTimeoutRef.current) {
        window.clearTimeout(failTimeoutRef.current);
      }

      try {
        popupWindowRef.current?.close();
      } catch {
        // ignore
      }
    },
    []
  );

  return (
    <>
      <Modal.Header
        title="Import from Zendesk"
        onClose={onClose}
        leftButton={<Modal.Header.Icon iconName="Zendesk" iconProps={{ name: 'Zendesk', width: '24.33px' }} />}
        testID={tid(testID, 'header')}
      />

      <Scroll style={{ display: 'block' }}>
        <Box height="150px" direction="column" justify="center" align="center" gap={12}>
          <LoadingSpinner size="large" testID={tid(testID, 'loading')} />
          <Text color={colors.neutralDark.neutralsDark900}>Awaiting authorization...</Text>
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button
          label="Cancel"
          variant="secondary"
          onClick={onClose}
          disabled={disabled}
          testID={tid(testID, 'cancel')}
        />
      </Modal.Footer>
    </>
  );
};
