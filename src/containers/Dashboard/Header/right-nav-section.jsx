import React from 'react';
import { Tooltip } from 'react-tippy';
import { Popover, PopoverBody } from 'reactstrap';

import RoundButton from '@/components/Button/RoundButton';
import Dropdown from '@/componentsV2/Dropdown';
import Menu, { MenuItem } from '@/componentsV2/Menu';
import { IS_PRODUCTION, YOUTUBE_CHANNEL_ID } from '@/config';
import { goToDesigner } from '@/ducks/router';
import { connect } from '@/hocs';

import UpdatesPopover from '../UpdatesPopover';

const YOUTUBE_CHANNEL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`;

function RightNavSection({
  updates_open,
  toggleUpdatesOpen,
  setNewProductUpdates,
  setShowUpdateBubble,
  product_updates,
  new_product_updates,
  renderUpdatesButton,
  goToDesigner,
}) {
  return (
    <>
      {!IS_PRODUCTION && (
        <div className="subheader-right nav-child-item" onClick={goToDesigner}>
          <RoundButton icon="star" imgSize={15} />
        </div>
      )}
      <div className="subheader-right nav-child-item">
        <div id="update-popup">{renderUpdatesButton()}</div>
        <Popover
          className="updates-popover-container"
          placement="bottom"
          isOpen={updates_open}
          target="update-popup"
          toggle={() => {
            toggleUpdatesOpen(!updates_open);
            setNewProductUpdates([]);
            setShowUpdateBubble(false);
          }}
        >
          <PopoverBody>
            <UpdatesPopover product_updates={product_updates} new_product_updates={new_product_updates} />
          </PopoverBody>
        </Popover>
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
