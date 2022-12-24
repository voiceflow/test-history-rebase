import { Dropdown, IconButton, IconButtonVariant, Menu, stopPropagation, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Notification, notificationsSelector, readNotifications } from '@/ducks/notifications';
import { connect } from '@/hocs/connect';
import { useToggle } from '@/hooks/toggle';
import { ConnectedProps } from '@/types';

import Numbered from './components/Numbered';
import UpdateBubble from './components/UpdateBubble';
import UpdatesPopover from './components/UpdatesPopover';

const DEFAULT_MESSAGE = [
  {
    details: 'There are no new updates available.',
    type: 'empty',
    created: 0,
  } as unknown as Notification,
];

const NotificationsButton: React.FC<ConnectedNotificationsButton> = ({ notifications, readNotifications }) => {
  const [onHover, toggleUpdatesHover] = useToggle(false);
  const newNotifications = React.useMemo(() => notifications.filter(({ isNew }) => isNew), [notifications]);

  return (
    <TippyTooltip title="Notifications" position="bottom">
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

const mapStateToProps = {
  notifications: notificationsSelector,
};

const mapDispatchToProps = {
  readNotifications,
};

type ConnectedNotificationsButton = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsButton);
