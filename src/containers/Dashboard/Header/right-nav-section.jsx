import React from 'react';
import { Tooltip } from 'react-tippy';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody } from 'reactstrap';

import RoundButton from '@/components/Button/RoundButton';
import { YOUTUBE_CHANNEL_ID } from '@/config';
import InformationIcon from '@/svgs/information.svg';

import UpdatesPopover from '../UpdatesPopover';

const YOUTUBE_CHANNEL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`;

export default function RightNavSection({
  updates_open,
  toggleUpdatesOpen,
  setNewProductUpdates,
  setShowUpdateBubble,
  product_updates,
  new_product_updates,
  showInfo,
  setShowInfo,
  renderUpdatesButton,
}) {
  return (
    <>
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
        <Dropdown isOpen={showInfo} toggle={() => setShowInfo(!showInfo)}>
          <DropdownToggle tag="div">
            <Tooltip distance={19} title="Resources" position="bottom">
              <RoundButton icon={InformationIcon} imgSize={15} active={showInfo} />
            </Tooltip>
          </DropdownToggle>
          <DropdownMenu className="mt-2">
            <a href="https://learn.voiceflow.com/" target="_blank" rel="noopener noreferrer">
              <DropdownItem>University</DropdownItem>
            </a>
            <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
              <DropdownItem>Youtube</DropdownItem>
            </a>
            <a href="https://www.facebook.com/groups/voiceflowgroup/" target="_blank" rel="noopener noreferrer">
              <DropdownItem>Community</DropdownItem>
            </a>
            <a href="https://forum.voiceflow.com/" target="_blank" rel="noopener noreferrer">
              <DropdownItem>Forums</DropdownItem>
            </a>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
