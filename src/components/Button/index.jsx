import cn from 'classnames';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { ClassName } from '@/styles/constants';

import { PrimaryButton, QuaternaryButton, SecondaryButton, TertiaryButton } from './components';
import { ButtonVariant } from './constants';

export { ButtonVariant };

const BUTTON_VARIANTS = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.TERTIARY]: TertiaryButton,
  [ButtonVariant.QUATERNARY]: QuaternaryButton,
};

function Button({ variant, className, isLoading = false, children, ...props }, ref) {
  const Component = BUTTON_VARIANTS[variant] || PrimaryButton;

  return (
    <Component isLoading={isLoading} className={cn(ClassName.BUTTON, className)} ref={ref} {...props}>
      {isLoading ? <SvgIcon icon="publishSpin" size={24} spin /> : children}
    </Component>
  );
}

export default React.forwardRef(Button);
