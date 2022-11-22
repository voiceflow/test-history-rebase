import { Dropdown, Menu, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Notification, notificationsSelector, NotificationType, readNotifications } from '@/ducks/notifications';
import { useSelector } from '@/hooks';
import { UpdatesPopover } from '@/pages/Dashboard/Header/components/NotificationsButton/components';

import { IconButtonContainer, UpdateBubble } from '../styles';

const DEFAULT_MESSAGE = [
  {
    details: 'There are no new updates available.',
    type: NotificationType.UPDATE,
    created: 0,
  } as unknown as Notification,
];

const NotificationButton: React.FC = () => {
  const notifications = useSelector(notificationsSelector);
  const newNotifications = React.useMemo(() => notifications.filter(({ isNew }) => isNew), [notifications]);

  const areNewNotifications = newNotifications.length > 0;

  return (
    <TippyTooltip title="Notifications" position="bottom">
      <Dropdown
        menu={
          <Menu maxHeight="500px">
            <UpdatesPopover notifications={areNewNotifications ? newNotifications : DEFAULT_MESSAGE} />
          </Menu>
        }
        placement="bottom-end"
      >
        {(ref, onToggle, isOpen) => (
          <IconButtonContainer
            ref={ref}
            active={isOpen}
            onClick={() => {
              onToggle();
              readNotifications();
            }}
          >
            {areNewNotifications ? (
              <div style={{ position: 'relative' }}>
                <UpdateBubble />
                <SvgIcon icon="notificationsOutline" size={15} />
              </div>
            ) : (
              <SvgIcon icon="notificationsOutline" />
            )}
          </IconButtonContainer>
        )}
      </Dropdown>
    </TippyTooltip>
  );
};

export default NotificationButton;
