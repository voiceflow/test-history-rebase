/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';

import Dropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';

import Container from './components/OverflowMenuContainer';

const DropdownAny = Dropdown as any;
const MenuAny = Menu as any;

export type OverflowMenuItem = {
  onClick: (e: React.MouseEvent) => any;
  label: string | React.ReactNode;
};

export type OverflowMenuProps = {
  options: OverflowMenuItem[];
  disabled?: boolean;
  onSelect?: (value: any) => void;
  placement: string;
};

function OverflowMenu({ options, onSelect, disabled, placement }: OverflowMenuProps) {
  return (
    <DropdownAny
      {...(onSelect
        ? { onSelect, options }
        : {
            menu: (
              <MenuAny>
                {options.map(({ onClick, label }, index) => (
                  <MenuItem key={index} onClick={onClick}>
                    {label}
                  </MenuItem>
                ))}
              </MenuAny>
            ),
          })}
      placement={placement}
    >
      {(ref: React.Ref<any>, onToggle: (e: React.MouseEvent) => any) => (
        <Container disabled={disabled} onClick={onToggle} ref={ref}>
          <SvgIcon icon="elipsis" />
        </Container>
      )}
    </DropdownAny>
  );
}

export default OverflowMenu;
