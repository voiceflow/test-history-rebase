import type { Nullable } from '@voiceflow/common';
import type { DropdownPlacement, OptionsMenuOption } from '@voiceflow/ui';
import { Button, Dropdown, OptionsMenu } from '@voiceflow/ui';
import React from 'react';

import { truthy } from '@/utils/typeGuards';

import * as S from './styles';

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
    {({ ref, onToggle, isOpen }) => (
      <S.Button
        disabled={disabled}
        onClick={onToggle}
        isActive={isOpen}
        ref={ref}
        variant={Button.Variant.SECONDARY}
        icon="ellipsis"
      />
    )}
  </Dropdown>
);

export default OverflowMenu;
