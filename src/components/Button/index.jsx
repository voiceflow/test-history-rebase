import React from 'react';

import { PrimaryButton, SecondaryButton, TertiaryButton } from './components';
import { ButtonVariant } from './constants';

export { ButtonVariant };

const BUTTON_VARIANTS = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.TERTIARY]: TertiaryButton,
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
