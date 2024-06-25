import SvgIcon from '@ui/components/SvgIcon';
import { ClassName } from '@ui/styles/constants';
import cn from 'classnames';
import React from 'react';

import type {
  PrimaryButtonProps,
  QuaternaryButtonProps,
  SecondaryButtonProps,
  TertiaryButtonProps,
  WhiteButtonProps,
} from './components';
import {
  BaseButton,
  baseButtonStyles,
  ButtonContainer,
  DarkButton,
  PrimaryButton,
  QuaternaryButton,
  SecondaryButton,
  TertiaryButton,
  WhiteButton,
} from './components';
import { ButtonVariant } from './constants';

export type {
  DarkButtonProps,
  PrimaryButtonProps,
  QuaternaryButtonProps,
  SecondaryButtonProps,
  TertiaryButtonProps,
} from './components';
export * from './components';
export { ButtonVariant };

const BUTTON_VARIANTS = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.TERTIARY]: TertiaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.QUATERNARY]: QuaternaryButton,
  [ButtonVariant.WHITE]: WhiteButton,
};

type ButtonProps =
  | PrimaryButtonProps
  | SecondaryButtonProps
  | TertiaryButtonProps
  | QuaternaryButtonProps
  | WhiteButtonProps;

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { variant = ButtonVariant.PRIMARY, className, children, ...props },
  ref
) => {
  const Component = (BUTTON_VARIANTS[variant] || PrimaryButton) as React.ForwardRefExoticComponent<any>;

  return (
    <Component ref={ref} className={cn(ClassName.BUTTON, className)} variant={variant} {...props}>
      {props.isLoading ? <SvgIcon icon="arrowSpin" size={props.iconProps?.size ?? 16} spin /> : children}
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
  WhiteButton,
  DarkButton,
});
