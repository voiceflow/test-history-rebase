import cn from 'classnames';
import React from 'react';

import Icon from '@/components/SvgIcon';
import { ClassName } from '@/styles/constants';

import { PrimaryButton, SecondaryButton, TertiaryButton } from './components';
import { ButtonVariant } from './constants';

export { ButtonVariant };

const BUTTON_VARIANTS = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.TERTIARY]: TertiaryButton,
};

function Button({ variant, className, loading = false, children, ...props }, ref) {
  const Component = BUTTON_VARIANTS[variant] || PrimaryButton;

  return (
    <Component loading={loading} className={cn(ClassName.BUTTON, className)} ref={ref} {...props}>
      {loading ? <Icon icon="publishSpin" size={24} spin /> : children}
    </Component>
  );
}

export default React.forwardRef(Button);
