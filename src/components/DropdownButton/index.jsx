import React from 'react';

import Dropdown from '@/components/Dropdown';

import PrimaryDropdownButton from './components/PrimaryDropdownButton';
import SecondaryDropdownButton from './components/SecondaryDropdownButton';

const DROPDOWN_VARIANTS = {
  primary: PrimaryDropdownButton,
  secondary: SecondaryDropdownButton,
};

function DropdownButton({ variant, options, menu, onSelect, disabled, children, dropdownProps, buttonProps }) {
  const Component = DROPDOWN_VARIANTS[variant] || PrimaryDropdownButton;

  return (
    <Dropdown options={options} menu={menu} onSelect={onSelect} placement="bottom-end" {...dropdownProps}>
      {(ref, onToggle) => (
        <Component disabled={disabled} onToggle={onToggle} ref={ref} buttonProps={buttonProps}>
          {children}
        </Component>
      )}
    </Dropdown>
  );
}

export default DropdownButton;
