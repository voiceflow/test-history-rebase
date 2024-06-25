import { Utils } from '@voiceflow/common';
import React from 'react';

import type { MenuItemMultilevel, UIOnlyMenuItemOption } from './NestedMenu';
import NestedMenu from './NestedMenu';

export interface OptionsMenuOption extends MenuItemMultilevel<OptionsMenuOption> {
  label: React.ReactNode;
  onClick?: VoidFunction;
  active?: boolean;
}

export interface OptionsMenuProps {
  onHide: VoidFunction;
  options: Array<OptionsMenuOption | UIOnlyMenuItemOption>;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ onHide, options = [] }) => (
  <NestedMenu
    onHide={onHide}
    options={options}
    onSelect={(option) => Utils.functional.chainVoid(onHide, option?.onClick)()}
    getOptionKey={(_, index) => String(index)}
    getOptionLabel={(option) => option?.label}
    getOptionValue={(option) => option}
    renderOptionLabel={(option) => option.label}
  />
);

export default OptionsMenu;
