import { Dropdown, getNestedMenuFormattedLabel, Menu, OverflowText, OverflowTippyTooltip, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Domain from '@/components/Domain';

interface MenuItemProps extends Domain.ActionsProps {
  name: string;
  search: string;
  isRoot?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
  withActions?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, isRoot, search, onClick, withActions = true, ...actionsProps }) => (
  <Dropdown menu={<Domain.Actions isRoot={isRoot} {...actionsProps} />} offset={{ offset: [-14, 24] }} placement="right-start" selfDismiss>
    {({ ref, onToggle, isOpen }) => (
      <Menu.Item active={isOpen} onClick={onClick}>
        <OverflowTippyTooltip content={name} overflow>
          {(ref) => (
            <>
              {isRoot && <Menu.ItemIcon icon="systemHome2" active={isOpen} />}
              <OverflowText ref={ref}>{getNestedMenuFormattedLabel(name, search)}</OverflowText>
            </>
          )}
        </OverflowTippyTooltip>

        {withActions && <Menu.ItemActionIcon ref={ref} icon="filter" onClick={stopPropagation(onToggle)} active={isOpen} />}
      </Menu.Item>
    )}
  </Dropdown>
);

export default MenuItem;
