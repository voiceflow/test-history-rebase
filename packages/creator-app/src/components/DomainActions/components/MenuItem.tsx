import { Dropdown, getNestedMenuFormattedLabel, Menu as UIMenu, OverflowText, OverflowTippyTooltip, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import MenuItemActions, { MenuItemActionsProps } from './MenuItemActions';

interface MenuItemProps extends MenuItemActionsProps {
  name: string;
  search: string;
  isRoot?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, isRoot, search, onClick, ...actionsProps }) => (
  <Dropdown menu={<MenuItemActions isRoot={isRoot} {...actionsProps} />} offset={{ offset: [-14, 24] }} placement="right-start" selfDismiss>
    {(ref, onToggle, isOpened) => (
      <UIMenu.Item active={isOpened} onClick={onClick}>
        <OverflowTippyTooltip title={name} overflow>
          {(ref) => (
            <>
              {isRoot && <UIMenu.ItemIcon ref={ref} icon="systemHome2" active={isOpened} />}
              <OverflowText ref={ref}>{getNestedMenuFormattedLabel(name, search)}</OverflowText>
            </>
          )}
        </OverflowTippyTooltip>

        <UIMenu.ItemActionIcon ref={ref} icon="filter" onClick={stopPropagation(onToggle)} active={isOpened} />
      </UIMenu.Item>
    )}
  </Dropdown>
);

export default MenuItem;
