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

  const onNotificationClick = () => {
    readNotifications();
    onClick?.();
  };

  return (
    <IconButtonContainer>
      <TippyTooltip title="Notifications" position="bottom">
        {newNotifications.length > 0 ? (
          <>
            <UpdateBubble
              onClick={stopPropagation(() => {
                onNotificationClick();
              })}
            >
              <span>{newNotifications.length}</span>
            </UpdateBubble>

            <Numbered>
              <SvgIcon icon="notifications" size={15} />
            </Numbered>
          </>
        ) : (
          <SvgIcon icon="notifications" onClick={onClick} />
        )}
      </TippyTooltip>
    </IconButtonContainer>
  );
};

export default NotificationButton;
