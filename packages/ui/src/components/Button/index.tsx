import cn from 'classnames';
import React from 'react';

import { ClassName } from '../../styles/constants';
import SvgIcon from '../SvgIcon';
import {
  PrimaryButton,
  PrimaryButtonProps,
  QuaternaryButton,
  QuaternaryButtonProps,
  SecondaryButton,
  SecondaryButtonProps,
  TertiaryButton,
  TertiaryButtonProps,
} from './components';
import { ButtonVariant } from './constants';

export * from './components';
export { ButtonVariant };

const BUTTON_VARIANTS = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.TERTIARY]: TertiaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.QUATERNARY]: QuaternaryButton,
};

type ButtonProps = PrimaryButtonProps | SecondaryButtonProps | TertiaryButtonProps | QuaternaryButtonProps;

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { variant = ButtonVariant.PRIMARY, className, children, ...props },
  ref
) => {
  const Component = (BUTTON_VARIANTS[variant] || PrimaryButton) as React.ForwardRefExoticComponent<any>;

  return (
    <Component ref={ref} className={cn(ClassName.BUTTON, className)} variant={variant} {...props}>
      {props.isLoading ? <SvgIcon icon="publishSpin" size={24} spin /> : children}
    </Component>
  );
};

export default React.forwardRef<HTMLButtonElement, ButtonProps>(Button);
