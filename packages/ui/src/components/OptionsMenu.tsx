import React from 'react';

import NestedMenu from './NestedMenu';

export interface OptionsMenuOption {
  label: React.ReactNode;
  options?: OptionsMenuOption[];
  disabled?: boolean;
  onClick?: () => void;
  menuItemProps?: any;
  menuProps?: any;
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getOptionKey={() => {}}
    renderOptionLabel={(option: OptionsMenuOption) => option.label}
    {...props}
  />
);

export default OptionsMenu;
