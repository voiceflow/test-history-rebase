import { ButtonVariant } from '@ui/components/Button/constants';
import SvgIcon, { SvgIconProps } from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

export interface PrimaryButtonProps extends S.PrimaryButtonContainerProps {
  icon?: SvgIconProps['icon'] | null;
  variant?: ButtonVariant.PRIMARY;
  iconProps?: Omit<SvgIconProps, 'icon'>;
}

const PrimaryButton: React.ForwardRefRenderFunction<HTMLButtonElement, PrimaryButtonProps> = (
  { icon, children, iconProps, isLoading, ...props },
  ref
) => (
  <S.PrimaryButtonContainer ref={ref} {...props}>
    <S.PrimaryButtonLabel isLoading={isLoading}>{children}</S.PrimaryButtonLabel>

    {icon && (
      <S.PrimaryButtonIcon>
        <SvgIcon icon={icon} color="#FFF" size={16} {...iconProps} />
      </S.PrimaryButtonIcon>
    )}
  </S.PrimaryButtonContainer>
);

export default Object.assign(React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(PrimaryButton), {
  Container: S.PrimaryButtonContainer,
  Icon: S.PrimaryButtonIcon,
  Label: S.PrimaryButtonLabel,
});
