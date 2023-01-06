import React from 'react';

import * as Notifications from '@/ducks/notifications';
import { styled } from '@/hocs/styled';

import Notification from './components/Notification';

export const NotificationContainer = styled.div`
  & > * {
    white-space: normal;
  }

  & :last-child {
    border-bottom: none !important;
  }
`;

interface UpdatesPopoverTypes {
  notifications: Notifications.Notification[];
}

const UpdatesPopover: React.OldFC<UpdatesPopoverTypes> = ({ notifications }) => (
  <NotificationContainer>
    {notifications.map((notification, i) => (
      <Notification data={notification} key={i} />
    ))}
  </NotificationContainer>
);

export default UpdatesPopover;
