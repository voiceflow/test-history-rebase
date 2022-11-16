import { stopPropagation, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { notificationsSelector, readNotifications } from '@/ducks/notifications';
import { useSelector } from '@/hooks';
import Numbered from '@/pages/Dashboard/Header/components/NotificationsButton/components/Numbered';
import UpdateBubble from '@/pages/Dashboard/Header/components/NotificationsButton/components/UpdateBubble';

import { IconButtonContainer } from '../styles';

interface NotificationButtonProps {
  onClick?: VoidFunction;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ onClick }) => {
  const notifications = useSelector(notificationsSelector);
  const newNotifications = React.useMemo(() => notifications.filter(({ isNew }) => isNew), [notifications]);

  const areNewNotifications = newNotifications.length > 0;

  const onNotificationClick = () => {
    readNotifications();
    onClick?.();
  };

  return (
    <IconButtonContainer
      onClick={
        areNewNotifications
          ? stopPropagation(() => {
              onNotificationClick();
            })
          : onClick
      }
    >
      <TippyTooltip title="Notifications" position="bottom">
        {newNotifications.length > 0 ? (
          <>
            <UpdateBubble>
              <span>{newNotifications.length}</span>
            </UpdateBubble>

            <Numbered>
              <SvgIcon icon="notificationsOutline" size={15} />
            </Numbered>
          </>
        ) : (
          <SvgIcon icon="notificationsOutline" />
        )}
      </TippyTooltip>
    </IconButtonContainer>
  );
};

export default NotificationButton;
