import React from 'react';

import * as Notifications from '@/ducks/notifications';

import { Notification } from './components';
import * as S from './styles';

interface UpdatesPopoverTypes {
  notifications: Notifications.Notification[];
}

const UpdatesPopover: React.FC<UpdatesPopoverTypes> = ({ notifications }) => (
  <S.Container>
    {notifications.map((notification, index) => (
      <Notification key={index} data={notification} />
    ))}
  </S.Container>
);

export default UpdatesPopover;
