/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';

import Dropdown, { DropdownPlacement } from '@/components/Dropdown';
import Menu, { MenuOption, MenuProps } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';

import Container from './components/OverflowMenuContainer';

export type OverflowMenuProps<T = undefined> = {
  menu?: React.ReactNode;
  options?: MenuOption<T>[];
  disabled?: boolean;
  onSelect?: MenuProps<T>['onSelect'];
  placement?: DropdownPlacement;
  selfDismiss?: boolean;
};

const OverflowMenu = <T extends any = undefined>({ menu, options, onSelect, disabled, placement, selfDismiss }: OverflowMenuProps<T>) => (
  <Dropdown<T>
    {...(onSelect ? { onSelect, options } : { menu: menu || <Menu options={options!} /> })}
    placement={placement}
    selfDismiss={selfDismiss}
  >
    {(ref, onToggle) => (
      <Container disabled={disabled} onClick={onToggle} ref={ref}>
        <SvgIcon icon="elipsis" />
      </Container>
    )}
  </Dropdown>
);

export default OverflowMenu;
