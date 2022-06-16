import { Box, SvgIcon, SvgIconTypes, toast } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { NLUNotificationItem } from '../..';
import { Container, IconContainer } from './components';

interface NotificationItemProps {
  data: NLUNotificationItem;
}

const NOTIFICATION_ITEM_ICONS: Record<InteractionModelTabType, SvgIconTypes.Icon> = {
  [InteractionModelTabType.SLOTS]: 'entities',
  [InteractionModelTabType.INTENTS]: 'intent',
  [InteractionModelTabType.VARIABLES]: 'variables',
};

const NotificationItem: React.FC<NotificationItemProps> = ({ data }) => {
  const nluManager = React.useContext(NLUManagerContext);

  const { title, message, itemID, type } = data;

  const jumpToItem = () => {
    // eslint-disable-next-line sonarjs/no-gratuitous-expressions
    if (true) {
      toast.warn('Placeholder');
    } else {
      nluManager.goToTab(type, itemID);
    }
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
