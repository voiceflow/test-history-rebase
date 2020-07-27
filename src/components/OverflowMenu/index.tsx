/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';

import Dropdown, { DropdownPlacement } from '@/components/Dropdown';
import Menu, { MenuOption, MenuProps } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';

import Container from './components/OverflowMenuContainer';

export type OverflowMenuProps<T = undefined> = {
  options: MenuOption<T>[];
  disabled?: boolean;
  onSelect?: MenuProps<T>['onSelect'];
  placement?: DropdownPlacement;
};

const OverflowMenu = <T extends any = undefined>({ options, onSelect, disabled, placement }: OverflowMenuProps<T>) => (
  <Dropdown<T> {...(onSelect ? { onSelect, options } : { menu: <Menu options={options} /> })} placement={placement}>
    {(ref, onToggle) => (
      <Container disabled={disabled} onClick={onToggle} ref={ref}>
        <SvgIcon icon="elipsis" />
      </Container>
    )}
  </Dropdown>
);

export default OverflowMenu;
