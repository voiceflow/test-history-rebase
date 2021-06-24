import cn from 'classnames';
import React from 'react';

import { ClassName } from '../../styles/constants';
import SvgIcon from '../SvgIcon';
import { PrimaryButton, QuaternaryButton, SecondaryButton, TertiaryButton } from './components';
import { PrimaryButtonProps } from './components/PrimaryButton';
import { SecondaryButtonProps } from './components/SecondaryButton';
import { ButtonVariant } from './constants';

export * from './components';
export * from './styles';
export { ButtonVariant };

const BUTTON_VARIANTS = {
  [ButtonVariant.PRIMARY]: PrimaryButton,
  [ButtonVariant.SECONDARY]: SecondaryButton,
  [ButtonVariant.TERTIARY]: TertiaryButton,
  [ButtonVariant.QUATERNARY]: QuaternaryButton,
};

interface ButtonProps extends Pick<React.ComponentProps<'button'>, 'type' | 'id' | 'className' | 'style'>, PrimaryButtonProps, SecondaryButtonProps {
  variant?: ButtonVariant | `${ButtonVariant}`;
}

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, React.PropsWithChildren<ButtonProps>> = (
  { variant = ButtonVariant.PRIMARY, className, isLoading = false, children, ...props },
  ref
) => {
  const Component = BUTTON_VARIANTS[variant] || PrimaryButton;

  return (
    <Component isLoading={isLoading} className={cn(ClassName.BUTTON, className)} ref={ref} {...props}>
      {isLoading ? <SvgIcon icon="publishSpin" size={24} spin /> : children}
    </Component>
  );
};

export default React.forwardRef(Button);
