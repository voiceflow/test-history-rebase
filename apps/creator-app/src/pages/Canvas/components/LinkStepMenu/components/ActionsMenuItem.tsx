import React from 'react';

import ActionsSubMenu from './ActionsSubMenu';
import MenuItem from './MenuItem';

interface ActionsMenuItemProps {
  parentPath: string;
  sourcePortID: string | null;
  parentParams: Record<string, string>;
  popperContainerRef?: React.Ref<HTMLDivElement>;
}

const ActionsMenuItem: React.FC<ActionsMenuItemProps> = ({
  parentPath,
  sourcePortID,
  parentParams,
  popperContainerRef,
}) => (
  <MenuItem label="Actions">
    <ActionsSubMenu
      ref={popperContainerRef}
      parentPath={parentPath}
      sourcePortID={sourcePortID}
      parentParams={parentParams}
    />
  </MenuItem>
);

export default React.memo(ActionsMenuItem);
