import { Nullable } from '@voiceflow/common';
import { Dropdown, DropdownPlacement, OptionsMenu, OptionsMenuOption, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { truthy } from '@/utils/typeGuards';

import Container from './components/OverflowMenuContainer';

export interface OverflowMenuProps {
  menu?: React.ReactNode;
  options?: Nullable<OptionsMenuOption>[];
  disabled?: boolean;
  placement?: DropdownPlacement;
  selfDismiss?: boolean;
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({ menu, options = [], disabled, placement, selfDismiss }) => (
  <Dropdown
    menu={menu || ((onToggle) => <OptionsMenu onHide={onToggle} options={options.filter(truthy)} />)}
    placement={placement}
    selfDismiss={selfDismiss}
  >
    {(ref, onToggle) => (
      <Container disabled={disabled} onClick={onToggle} ref={ref}>
        <SvgIcon icon="ellipsis" />
      </Container>
    )}
  </Dropdown>
);

export default OverflowMenu;
