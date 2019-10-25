import React from 'react';
import { Tooltip } from 'react-tippy';

import RoundButton from '@/components/Button/RoundButton';
import SvgIcon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import Menu, { MenuItem } from '@/componentsV2/Menu';
import { IS_PRODUCTION, YOUTUBE_CHANNEL_ID } from '@/config';
import { goToDesigner } from '@/ducks/router';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks/toggle';
import { stopPropagation } from '@/utils/dom';

import UpdatesPopover from '../UpdatesPopover';
import { Numbered, UpdateBubble } from './components';

const YOUTUBE_CHANNEL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`;

function RightNavSection({
  setNewProductUpdates,
  setShowUpdateBubble,
  product_updates,
  new_product_updates,
  goToDesigner,
  updateButtonClick,
  show_update_bubble,
  updatesCount,
}) {
  const [onHover, toggleUpdatesHover] = useToggle(false);

  return (
    <>
      {!IS_PRODUCTION && (
        <div className="subheader-right nav-child-item" onClick={goToDesigner}>
          <RoundButton icon="star" imgSize={15} />
        </div>
      )}

      <div className="subheader-right nav-child-item">
        {/* notifications component */}
        <Dropdown
          menu={
            <Menu>
              <UpdatesPopover product_updates={product_updates} new_product_updates={new_product_updates} />
            </Menu>
          }
          placement="bottom-end"
        >
          {(ref, onToggle, isOpen) => {
            return (
              <div style={{ position: 'relative' }} onMouseEnter={toggleUpdatesHover} onMouseLeave={toggleUpdatesHover}>
                {/* if updates available show notifications bubble and expand it on hover */}
                {show_update_bubble ? (
                  <>
                    <UpdateBubble
                      ref={ref}
                      onClick={stopPropagation(() => {
                        onToggle();
                        updateButtonClick();
                        setNewProductUpdates([]);
                        setShowUpdateBubble(false);
                      })}
                      expand={onHover || isOpen}
                    >
                      <span>{updatesCount}</span>
                    </UpdateBubble>
                    <Numbered>
                      <SvgIcon icon="notifications" size={15} />
                    </Numbered>
                  </>
                ) : (
                  // else just show button with notifications icon
                  <RoundButton
                    ref={ref}
                    active={isOpen}
                    icon="notifications"
                    onClick={() => {
                      onToggle();
                      updateButtonClick();
                    }}
                    imgSize={15}
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
          {(ref, onToggle) => (
            <Tooltip distance={19} title="Resources" position="bottom">
              <RoundButton icon="information" imgSize={15} onClick={onToggle} ref={ref} />
            </Tooltip>
          )}
        </Dropdown>
      </div>
    </>
  );
}

const mapDispatchToProps = {
  goToDesigner,
};

export default connect(
  null,
  mapDispatchToProps
)(RightNavSection);
