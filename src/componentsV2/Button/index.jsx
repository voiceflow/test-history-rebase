import React from 'react';

import PrimaryButton from './components/PrimaryButton';
import SecondaryButton from './components/SecondaryButton';
import TertiaryButton from './components/TertiaryButton';

const BUTTON_VARIANTS = {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  tertiary: TertiaryButton,
};

function Button({ variant, children, ...props }) {
  const Component = BUTTON_VARIANTS[variant] || PrimaryButton;

  return <Component {...props}>{children}</Component>;
}

export default Button;
