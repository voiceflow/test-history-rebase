import cn from 'classnames';
import React from 'react';

import { ClassName } from '@/styles/constants';

import { PrimaryButton, SecondaryButton, TertiaryButton } from './components';
import { ButtonVariant } from './constants';

export { ButtonVariant };

const BUTTON_VARIANTS = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.TERTIARY]: TertiaryButton,
};

function Button({ variant, className, children, ...props }, ref) {
  const Component = BUTTON_VARIANTS[variant] || PrimaryButton;

  return (
    <Component className={cn(ClassName.BUTTON, className)} ref={ref} {...props}>
      {children}
    </Component>
  );
}

export default React.forwardRef(Button);
