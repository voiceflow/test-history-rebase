import { Dropdown, getNestedMenuFormattedLabel, Menu, OverflowText, OverflowTippyTooltip, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Domain from '@/components/Domain';

interface MenuItemProps extends Domain.ActionsProps {
  name: string;
  search: string;
  isRoot?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, isRoot, search, onClick, ...actionsProps }) => (
  <Dropdown menu={<Domain.Actions isRoot={isRoot} {...actionsProps} />} offset={{ offset: [-14, 24] }} placement="right-start" selfDismiss>
    {(ref, onToggle, isOpened) => (
      <Menu.Item active={isOpened} onClick={onClick}>
        <OverflowTippyTooltip content={name} overflow>
          {(ref) => (
            <>
              {isRoot && <Menu.ItemIcon ref={ref} icon="systemHome2" active={isOpened} />}
              <OverflowText ref={ref}>{getNestedMenuFormattedLabel(name, search)}</OverflowText>
            </>
          )}
        </OverflowTippyTooltip>

        <Menu.ItemActionIcon ref={ref} icon="filter" onClick={stopPropagation(onToggle)} active={isOpened} />
      </Menu.Item>
    )}
  </Dropdown>
);

export default MenuItem;
