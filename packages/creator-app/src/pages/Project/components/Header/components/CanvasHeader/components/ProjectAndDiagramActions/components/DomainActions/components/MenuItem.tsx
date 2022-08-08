import { Dropdown, getNestedMenuFormattedLabel, Menu as UIMenu, OverflowText, OverflowTippyTooltip, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import MenuItemActions from './MenuItemActions';

interface MenuItemProps {
  id: string;
  name: string;
  search: string;
  isHome?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}

const MenuItem: React.FC<MenuItemProps> = ({ id, name, isHome, search, onClick }) => {
  return (
    <Dropdown menu={<MenuItemActions id={id} isHome={isHome} />} offset={{ offset: [-14, 24] }} placement="right-start" selfDismiss>
      {(ref, onToggle, isOpened) => (
        <UIMenu.Item active={isOpened} onClick={onClick}>
          <OverflowTippyTooltip title={name} overflow>
            {(ref) => (
              <>
                {isHome && <SvgIcon mr={16} variant={SvgIcon.Variant.STANDARD} icon="returnHome" />}
                <OverflowText ref={ref}>{getNestedMenuFormattedLabel(name, search)}</OverflowText>
              </>
            )}
          </OverflowTippyTooltip>

          <UIMenu.ActionIcon ref={ref} icon="filter" onClick={stopPropagation(onToggle)} active={isOpened} />
        </UIMenu.Item>
      )}
    </Dropdown>
  );
};

export default MenuItem;
