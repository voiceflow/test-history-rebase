import { MenuItemProps } from '@ui/components/Select';
import React from 'react';

import NestedMenu from './NestedMenu';

export interface OptionsMenuOption {
  label: React.ReactNode;
  onClick?: () => void;
  options?: OptionsMenuOption[];
  disabled?: boolean;
  menuProps?: any;
  menuItemProps?: MenuItemProps;
}

const NestedMenuAny: React.FC<any> = NestedMenu;

export interface OptionsMenuProps {
  options: OptionsMenuOption[];
  onToggle?: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ options = [], onToggle }, ...props) => (
  <NestedMenuAny
    options={options}
    onSelect={(option: OptionsMenuOption) => {
      onToggle?.();
      option?.onClick?.();
    }}
    getOptionKey={(_: OptionsMenuOption, index: number) => index}
    renderOptionLabel={(option: OptionsMenuOption) => option.label}
    {...props}
  />
);

export default OptionsMenu;
