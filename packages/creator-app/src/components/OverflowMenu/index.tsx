import { Nullable } from '@voiceflow/common';
import { ButtonVariant, Dropdown, DropdownPlacement, OptionsMenu, OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import { truthy } from '@/utils/typeGuards';

import * as S from './styles';

export interface OverflowMenuProps {
  menu?: React.ReactNode;
  options?: Nullable<OptionsMenuOption>[];
  disabled?: boolean;
  placement?: DropdownPlacement;
  style?: {
    flat?: boolean;
  };
  selfDismiss?: boolean;
}

const OverflowMenu: React.OldFC<OverflowMenuProps> = ({ menu, options = [], disabled, placement, selfDismiss, style = {} }) => (
  <Dropdown
    menu={menu || ((onToggle) => <OptionsMenu onHide={onToggle} options={options.filter(truthy)} />)}
    placement={placement}
    selfDismiss={selfDismiss}
  >
    {(ref, onToggle, isOpen) => (
      <S.Button
        disabled={disabled}
        onClick={onToggle}
        isActive={isOpen}
        ref={ref}
        flat={style?.flat}
        variant={ButtonVariant.SECONDARY}
        icon="ellipsis"
      />
    )}
  </Dropdown>
);

export default OverflowMenu;
