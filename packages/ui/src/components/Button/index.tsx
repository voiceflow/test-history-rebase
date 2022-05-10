import SvgIcon from '@ui/components/SvgIcon';
import { ClassName } from '@ui/styles/constants';
import cn from 'classnames';
import React from 'react';

import {
  BaseButton,
  baseButtonStyles,
  ButtonContainer,
  PrimaryButton,
  PrimaryButtonContainer,
  PrimaryButtonIcon,
  PrimaryButtonLabel,
  PrimaryButtonProps,
  QuaternaryButton,
  QuaternaryButtonProps,
  SecondaryButton,
  SecondaryButtonContainer,
  SecondaryButtonIcon,
  SecondaryButtonProps,
  TertiaryButton,
  TertiaryButtonProps,
} from './components';
import { ButtonVariant } from './constants';

export type { PrimaryButtonProps, QuaternaryButtonProps, SecondaryButtonProps, TertiaryButtonProps } from './components';
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

export default Object.assign(React.forwardRef<HTMLButtonElement, ButtonProps>(Button), {
  Variant: ButtonVariant,
  baseButtonStyles,

  BaseButton,
  PrimaryButton,
  TertiaryButton,
  ButtonContainer,
  SecondaryButton,
  QuaternaryButton,
  PrimaryButtonIcon,
  PrimaryButtonLabel,
  SecondaryButtonIcon,
  PrimaryButtonContainer,
  SecondaryButtonContainer,
});
