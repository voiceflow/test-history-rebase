import { Dropdown, getNestedMenuFormattedLabel, Menu as UIMenu, OverflowText, OverflowTippyTooltip, stopPropagation, SvgIcon } from '@voiceflow/ui';
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
              {isRoot && <SvgIcon mr={16} variant={SvgIcon.Variant.STANDARD} icon="systemHome2" />}
              <OverflowText ref={ref}>{getNestedMenuFormattedLabel(name, search)}</OverflowText>
            </>
          )}
        </OverflowTippyTooltip>

        <UIMenu.ActionIcon ref={ref} icon="filter" onClick={stopPropagation(onToggle)} active={isOpened} />
      </UIMenu.Item>
    )}
  </Dropdown>
);

export default MenuItem;
