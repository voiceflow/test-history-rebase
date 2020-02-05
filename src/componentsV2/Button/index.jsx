import React from 'react';

import { PrimaryButton, SecondaryButton, TertiaryButton } from './components';

const BUTTON_VARIANTS = {
  primary: PrimaryButton,
  secondary: SecondaryButton,
  tertiary: TertiaryButton,
};

function Button({ variant, children, ...props }, ref) {
  const Component = BUTTON_VARIANTS[variant] || PrimaryButton;

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}

export default React.forwardRef(Button);
