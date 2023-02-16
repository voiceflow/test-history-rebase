import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { NLURoute } from '@/config/routes';
import { useTrackingEvents } from '@/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { NOTIFICATION_ITEM_ICONS } from '../../constants';
import { NLUNotificationItem } from '../../types';
import { Container, IconContainer } from './components';

interface NotificationItemProps {
  data: NLUNotificationItem;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ data, onClose }) => {
  const nluManager = React.useContext(NLUManagerContext);
  const [trackingEvents] = useTrackingEvents();

  const { title, message, itemID, type } = data;

  const jumpToItem = () => {
    nluManager.goToTab(NLURoute.INTENTS, itemID);
    trackingEvents.trackNLUNotificationsOpened();
    onClose();
  };

  return (
    <Container display="flex" onClick={jumpToItem} flexDirection="row">
      <Box width={60}>
        <IconContainer>
          <SvgIcon icon={NOTIFICATION_ITEM_ICONS[type]} color="#6e849a" />
        </IconContainer>
      </Box>

      <Box flex={2}>
        <Box color="#bd425f" fontWeight={600} fontSize={13} mb={4}>
          {title}
        </Box>

        <Box>{message}</Box>
      </Box>
    </Container>
  );
};

export default NotificationItem;
