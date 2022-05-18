import { Box, Icon, SvgIcon, toast } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { NLUNotificationItem } from '../..';
import { Container, IconContainer } from './components';

interface NotificationItemProps {
  data: NLUNotificationItem;
}

const NOTIFICATION_ITEM_ICONS = {
  [InteractionModelTabType.INTENTS]: 'intent',
  [InteractionModelTabType.SLOTS]: 'entities',
  [InteractionModelTabType.VARIABLES]: 'variables',
};

const NotificationItem: React.FC<NotificationItemProps> = ({ data }) => {
  const { goToEntity } = React.useContext(NLUManagerContext);

  const { title, message, itemID, type } = data;

  const jumpToItem = () => {
    // eslint-disable-next-line sonarjs/no-gratuitous-expressions
    if (true) {
      toast.warn('Placeholder');
    } else {
      goToEntity(type, itemID);
    }
  };
  return (
    <Container display="flex" onClick={jumpToItem} flexDirection="row">
      <Box width={70}>
        <IconContainer>
          <SvgIcon icon={NOTIFICATION_ITEM_ICONS[type] as Icon} color="#6e849a" />
        </IconContainer>
      </Box>
      <Box flex={2}>
        <Box color="#bd425f" fontWeight={600}>
          {title}
        </Box>
        <Box>{message}</Box>
      </Box>
    </Container>
  );
};

export default NotificationItem;
