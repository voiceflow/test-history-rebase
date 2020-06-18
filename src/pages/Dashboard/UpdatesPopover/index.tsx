import React from 'react';

import { styled } from '@/hocs';

import Notification, { NotificationType } from './components/Notification';

export const NotificationContainer = styled.div`
  & > * {
    white-space: normal;
  }

  & :last-child {
    border-bottom: none !important;
  }
`;

type UpdatesPopoverTypes = {
  notifications: NotificationType[];
};

const UpdatesPopover: React.FC<UpdatesPopoverTypes> = ({ notifications }) => {
  return (
    <NotificationContainer>
      {notifications.map((notification, i) => {
        return <Notification data={notification} key={i} />;
      })}
    </NotificationContainer>
  );
};

export default UpdatesPopover;
