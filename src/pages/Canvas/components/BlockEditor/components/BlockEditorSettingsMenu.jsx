import React from 'react';
import { Tooltip } from 'react-tippy';

import Dropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import { ManagerContext } from '@/pages/Canvas/contexts';
import { swallowEvent } from '@/utils/dom';

const BlockEditorSettingsMenu = ({ data, onExpand, onDuplicate, onRemove, addReprompt }) => {
  const { reprompt } = React.useContext(ManagerContext)(data.type);

  return (
    <Dropdown
      menu={
        <Menu>
          <MenuItem disabled onClick={swallowEvent()}>
            Block Options
          </MenuItem>
          {reprompt && !data.reprompt && <MenuItem onClick={addReprompt}>Reprompt</MenuItem>}
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
