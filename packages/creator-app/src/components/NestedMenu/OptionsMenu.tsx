import React from 'react';

import NestedMenu from './index';

export interface MenuOption {
  label: React.ReactNode;
  options?: MenuOption[];
  disabled?: boolean;
  onClick?: () => void;
  menuItemProps?: any;
  menuProps?: any;
}

const NestedMenuAny: React.FC<any> = NestedMenu;

export interface OptionsMenuProps {
  options: MenuOption[];
  onToggle?: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ options = [], onToggle }, ...props) => (
  <NestedMenuAny
    options={options}
    onSelect={(option: MenuOption) => {
      onToggle?.();
      option?.onClick?.();
    }}
    getOptionKey={() => {}}
    renderOptionLabel={(option: MenuOption) => option.label}
    {...props}
  />
);

export default OptionsMenu;
