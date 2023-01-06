import { Dropdown, IconButton, IconButtonVariant, Menu, stopPropagation, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Notifications from '@/ducks/notifications';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useToggle } from '@/hooks/toggle';

import Numbered from './components/Numbered';
import UpdateBubble from './components/UpdateBubble';
import UpdatesPopover from './components/UpdatesPopover';

const DEFAULT_MESSAGE = [
  {
    details: 'There are no new updates available.',
    type: 'empty',
    created: 0,
  } as unknown as Notifications.Notification,
];

const NotificationsButton: React.FC = () => {
  const notifications = useSelector(Notifications.notificationsSelector);
  const readNotifications = useDispatch(Notifications.readNotifications);

  const [onHover, toggleUpdatesHover] = useToggle(false);
  const newNotifications = React.useMemo(() => notifications.filter(({ isNew }) => isNew), [notifications]);

  return (
    <TippyTooltip content="Notifications" position="bottom">
      {/* notifications component */}
      <Dropdown
        menu={
          <Menu maxHeight="500px">
            <UpdatesPopover notifications={notifications.length ? notifications : DEFAULT_MESSAGE} />
          </Menu>
        }
        placement="bottom-end"
      >
        {(ref, onToggle, isOpen) => (
          <div style={{ position: 'relative' }} onMouseEnter={toggleUpdatesHover} onMouseLeave={toggleUpdatesHover}>
            {/* if updates available show notifications bubble and expand it on hover */}
            {newNotifications.length > 0 ? (
              <>
                <UpdateBubble
                  ref={ref}
                  onClick={stopPropagation(() => {
                    onToggle();
                    readNotifications();
                  })}
                  expand={onHover || isOpen}
                >
                  <span>{newNotifications.length}</span>
                </UpdateBubble>

                <Numbered>
                  <SvgIcon icon="notifications" size={15} />
                </Numbered>
              </>
            ) : (
              // else just show button with notifications icon
              <IconButton
                ref={ref}
                variant={IconButtonVariant.OUTLINE}
                active={isOpen}
                icon="notifications"
                onClick={() => {
                  onToggle();
                  readNotifications();
                }}
                iconProps={{ width: 16, height: 15 }}
                large
              />
            )}
          </div>
        )}
      </Dropdown>
    </TippyTooltip>
  );
};

export default NotificationsButton;
