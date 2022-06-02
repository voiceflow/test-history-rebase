import { ButtonVariant } from '@ui/components/Button/constants';
import { SvgIconProps } from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

export interface WhiteButtonProps extends S.ContainerProps {
  icon?: SvgIconProps['icon'] | null;
  iconProps?: Omit<SvgIconProps, 'icon'>;
  variant: ButtonVariant.WHITE;
}

const WhiteButton: React.ForwardRefRenderFunction<HTMLButtonElement, WhiteButtonProps> = ({ icon, children, iconProps, ...props }, ref) => (
  <S.Container ref={ref} {...props}>
    {children && <S.Label>{children}</S.Label>}
    {icon && <S.Icon icon={icon} size={16} {...iconProps} />}
  </S.Container>
);

export default Object.assign(React.forwardRef<HTMLButtonElement, WhiteButtonProps>(WhiteButton), {
  Container: S.Container,
  Icon: S.Icon,
  Label: S.Label,
});
