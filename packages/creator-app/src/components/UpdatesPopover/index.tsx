import React from 'react';

import * as Notifications from '@/ducks/notifications';
import { useDispatch, useTeardown } from '@/hooks';

import { Notification } from './components';
import * as S from './styles';

interface UpdatesPopoverTypes {
  notifications: Notifications.Notification[];
}

const UpdatesPopover: React.FC<UpdatesPopoverTypes> = ({ notifications }) => {
  const readNotifications = useDispatch(Notifications.readNotifications);

  useTeardown(() => {
    readNotifications();
  });

  return (
    <S.Container>
      {notifications.map((notification, index) => (
        <Notification key={index} data={notification} />
      ))}
    </S.Container>
  );
};

export default UpdatesPopover;
