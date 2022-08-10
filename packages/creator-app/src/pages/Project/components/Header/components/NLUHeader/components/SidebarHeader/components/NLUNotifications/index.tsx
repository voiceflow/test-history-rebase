import { Box, Button, ButtonVariant, Flex, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { Container, ItemsContainer } from './components';
import NotificationItem from './components/NotificationItem';
import { getNotificationMessage, NOTIFICATION_TITLE } from './constants';
import { NLUNotificationItem } from './types';

interface NLUNotificationsProps {
  onClose: () => void;
}

const NLUNotifications: React.FC<NLUNotificationsProps> = ({ onClose }) => {
  const { notifications, fetchClarity, isFetchingClarity } = useNLUManager();
  const [isLoading, setIsLoading] = React.useState(false);

  const notificationList = React.useMemo<NLUNotificationItem[]>(() => {
    return notifications.map((notification) => ({
      type: notification.type,
      title: NOTIFICATION_TITLE[notification.type],
      message: getNotificationMessage[notification.type](notification.intent),
      itemID: notification.intent.id,
    }));
  }, [notifications]);

  const handleRefresh = async () => {
    setIsLoading(true);
    fetchClarity();
  };

  React.useEffect(() => {
    if (!isFetchingClarity) {
      setIsLoading(false);
    }
  }, [isFetchingClarity]);

  return (
    <Container>
      {notifications.length ? (
        <ItemsContainer>
          {notificationList.map((notification, index) => {
            return <NotificationItem data={notification} key={index} onClose={onClose} />;
          })}
        </ItemsContainer>
      ) : (
        <Box mt={15} height={50} display="flex" alignItems="center" justifyContent="center" color="#62778c">
          Nothing to show.
        </Box>
      )}
      <Box display="flex" p="0px 32px" justifyContent="flex-end" mt={14}>
        <Button variant={ButtonVariant.SECONDARY} onClick={handleRefresh} flat squareRadius>
          <Flex>
            <SvgIcon color="#6e849a" icon="arrowSpin" mr={12} inline spin={isLoading} />
            Refresh
          </Flex>
        </Button>
      </Box>
    </Container>
  );
};

export default NLUNotifications;
