import React from 'react';

import Dropdown from '@/componentsV2/Dropdown';

import PrimaryDropdownButton from './components/PrimaryDropdownButton';
import SecondaryDropdownButton from './components/SecondaryDropdownButton';

const DROPDOWN_VARIANTS = {
  primary: PrimaryDropdownButton,
  secondary: SecondaryDropdownButton,
};

function DropdownButton({ variant, options, onSelect, disabled, children }) {
  const Component = DROPDOWN_VARIANTS[variant] || PrimaryDropdownButton;

  return (
    <Dropdown options={options} onSelect={onSelect} placement="bottom-end">
      {(ref, onToggle) => (
        <Component disabled={disabled} onToggle={onToggle} ref={ref}>
          {children}
        </Component>
      )}
    </Dropdown>
  );
}

export default DropdownButton;
