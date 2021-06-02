import React from 'react';

import * as Notifications from '@/ducks/notifications';
import { styled } from '@/hocs';

import Notification from './components/Notification';

export const NotificationContainer = styled.div`
  & > * {
    white-space: normal;
  }

  & :last-child {
    border-bottom: none !important;
  }
`;

type UpdatesPopoverTypes = {
  notifications: Notifications.Notification[];
};

const UpdatesPopover: React.FC<UpdatesPopoverTypes> = ({ notifications }) => (
  <NotificationContainer>
    {notifications.map((notification, i) => (
      <Notification data={notification} key={i} />
    ))}
  </NotificationContainer>
);

export default UpdatesPopover;
