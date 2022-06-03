import { Box, Button, ButtonVariant, Flex, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';

import { Container, ItemsContainer } from './components';
import NotificationItem from './components/NotificationItem';

export interface NLUNotificationItem {
  type: InteractionModelTabType;
  title: string;
  message: string;
  itemID: string;
}

const DUMMY_NOTIFICATION_DATA = [
  {
    type: InteractionModelTabType.INTENTS,
    title: 'Confidence is low',
    message: 'Credit card intent needs more utterances',
    itemID: '123',
  },
  {
    type: InteractionModelTabType.SLOTS,
    title: 'Entity prompt missing',
    message: 'Car Brand intent contains entities with no default prompt',
    itemID: '123',
  },
  {
    type: InteractionModelTabType.INTENTS,
    title: 'Confidence is low',
    message: 'Credit card intent needs more utterances',
    itemID: '123',
  },
  {
    type: InteractionModelTabType.SLOTS,
    title: 'Entity prompt missing',
    message: 'Car Brand intent contains entities with no default prompt',
    itemID: '123',
  },
  {
    type: InteractionModelTabType.INTENTS,
    title: 'Confidence is low',
    message: 'Credit card intent needs more utterances',
    itemID: '123',
  },
  {
    type: InteractionModelTabType.SLOTS,
    title: 'Entity prompt missing',
    message: 'Car Brand intent contains entities with no default prompt',
    itemID: '123',
  },
];

const NLUNotifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<NLUNotificationItem[]>(DUMMY_NOTIFICATION_DATA);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
  };

  const handleRefresh = () => {};

  return (
    <Container>
      {notifications.length ? (
        <ItemsContainer>
          {notifications.map((notif, index) => {
            return <NotificationItem data={notif} key={index} />;
          })}
        </ItemsContainer>
      ) : (
        <Box mt={15} height={50} display="flex" alignItems="center" justifyContent="center" color="#62778c">
          Nothing to show.
        </Box>
      )}
      <Box display="flex" p="0px 32px" justifyContent="flex-end" mt={14}>
        <Button style={{ marginRight: 12 }} variant={ButtonVariant.SECONDARY} onClick={handleDelete} flat squareRadius>
          <Flex>
            <SvgIcon color="#6e849a" icon="trash" mr={12} inline />
            Delete
          </Flex>
        </Button>
        <Button variant={ButtonVariant.SECONDARY} onClick={handleRefresh} flat squareRadius>
          <Flex>
            <SvgIcon color="#6e849a" icon="publishSpin" mr={12} inline />
            Refresh
          </Flex>
        </Button>
      </Box>
    </Container>
  );
};

export default NLUNotifications;
