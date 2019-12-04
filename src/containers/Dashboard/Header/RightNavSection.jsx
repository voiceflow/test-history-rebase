import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import IconButton from '@/componentsV2/IconButton';
import Menu, { MenuItem } from '@/componentsV2/Menu';
import { IS_PRODUCTION, YOUTUBE_CHANNEL_ID } from '@/config';
import { notificationsSelector, readNotifications } from '@/ducks/notifications';
import { goToDesigner } from '@/ducks/router';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks/toggle';
import { stopPropagation } from '@/utils/dom';

import UpdatesPopover from '../UpdatesPopover';
import { Numbered, UpdateBubble } from './components';

const YOUTUBE_CHANNEL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`;

const DEFAULT_MESSAGE = [
  {
    details: 'There are no new updates available.',
    type: 'empty',
    created: 0,
  },
];

function RightNavSection({ notifications, goToDesigner, readNotifications }) {
  const [onHover, toggleUpdatesHover] = useToggle(false);
  const newNotifications = React.useMemo(() => notifications.filter(({ isNew }) => isNew), [notifications]);

  return (
    <>
      {!IS_PRODUCTION && (
        <div className="subheader-right nav-child-item" onClick={goToDesigner}>
          <IconButton icon="star" size={15} large variant="outline" />
        </div>
      )}

      <div className="subheader-right nav-child-item">
        {/* notifications component */}
        <Dropdown
          menu={
            <Menu>
              <UpdatesPopover notifications={notifications.length ? notifications : DEFAULT_MESSAGE} />
            </Menu>
          }
          placement="bottom-end"
        >
          {(ref, onToggle, isOpen) => {
            return (
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
                    variant="outline"
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
            );
          }}
        </Dropdown>
      </div>

      <div className="subheader-right nav-child-item">
        <Dropdown
          menu={
            <Menu>
              <a href="https://learn.voiceflow.com/" target="_blank" rel="noopener noreferrer">
                <MenuItem>University</MenuItem>
              </a>
              <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
                <MenuItem>Youtube</MenuItem>
              </a>
              <a href="https://www.facebook.com/groups/voiceflowgroup/" target="_blank" rel="noopener noreferrer">
                <MenuItem>Community</MenuItem>
              </a>
              <a href="https://forum.voiceflow.com/" target="_blank" rel="noopener noreferrer">
                <MenuItem>Forums</MenuItem>
              </a>
            </Menu>
          }
        >
          {(ref, onToggle, isOpen) => (
            <Tooltip distance={19} title="Resources" position="bottom">
              <IconButton
                active={isOpen}
                variant="outline"
                icon="information"
                iconProps={{ width: 16, height: 15 }}
                onClick={onToggle}
                ref={ref}
                large
              />
            </Tooltip>
          )}
        </Dropdown>
      </div>
    </>
  );
}

const mapStateToProps = {
  notifications: notificationsSelector,
};

const mapDispatchToProps = {
  goToDesigner,
  readNotifications,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightNavSection);
