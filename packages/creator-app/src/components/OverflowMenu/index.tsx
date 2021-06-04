/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';

import Dropdown, { DropdownPlacement } from '@/components/Dropdown';
import OptionsMenu, { MenuOption } from '@/components/NestedMenu/OptionsMenu';
import SvgIcon from '@/components/SvgIcon';
import { truthy } from '@/utils/typeGuards';

import Container from './components/OverflowMenuContainer';

export type OverflowMenuProps = {
  menu?: React.ReactNode;
  options?: (MenuOption | null)[];
  disabled?: boolean;
  placement?: DropdownPlacement;
  selfDismiss?: boolean;
};

const OverflowMenu = ({ menu, options = [], disabled, placement, selfDismiss }: OverflowMenuProps) => (
  <Dropdown
    menu={menu || ((onToggle) => <OptionsMenu options={options.filter(truthy)} onToggle={onToggle} />)}
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
