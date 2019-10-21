import React from 'react';
import { Tooltip } from 'react-tippy';

import Dropdown from '@/componentsV2/Dropdown';
import Menu, { MenuItem } from '@/componentsV2/Menu';
import { PlatformType } from '@/constants';
import { getManager } from '@/containers/CanvasV2/managers';
import { swallowEvent } from '@/utils/dom';
import { noop } from '@/utils/functional';

const BlockEditorSettingsMenu = ({ platform, data, onExpand, onDuplicate, onRemove, addReprompt }) => {
  const isGoogle = platform === PlatformType.GOOGLE;
  const { reprompt, chips } = getManager(data.type);

  return (
    <Dropdown
      menu={
        <Menu>
          <MenuItem disabled onClick={swallowEvent()}>
            Block Options
          </MenuItem>
          {/* TODO: */}
          {reprompt && !data.reprompt && <MenuItem onClick={addReprompt}>Reprompt</MenuItem>}
          {isGoogle && chips && !data.chips && <MenuItem onClick={noop}>Chips</MenuItem>}
          <MenuItem onClick={onExpand}>Expand</MenuItem>
          <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
          <MenuItem onClick={onRemove}>Delete</MenuItem>
        </Menu>
      }
      placement="bottom-end"
    >
      {(ref, onToggle) => (
        <Tooltip html="Settings" position="left" distance={10}>
          <div className="cog" ref={ref} onClick={onToggle} />
        </Tooltip>
      )}
    </Dropdown>
  );
};

export default BlockEditorSettingsMenu;
