import React from 'react';

import PrimaryDropdownButton from './components/PrimaryDropdownButton';
import SecondaryDropdownButton from './components/SecondaryDropdownButton';

const DROPDOWN_VARIANTS = {
  primary: PrimaryDropdownButton,
  secondary: SecondaryDropdownButton,
};

function DropdownButton({ variant, ...props }) {
  const Component = DROPDOWN_VARIANTS[variant] || PrimaryDropdownButton;

  return <Component {...props} />;
}

export default DropdownButton;
