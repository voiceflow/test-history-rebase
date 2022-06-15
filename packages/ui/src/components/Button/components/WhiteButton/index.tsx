import { ButtonVariant } from '@ui/components/Button/constants';
import { SvgIconTypes } from '@ui/components/SvgIcon';
import React from 'react';

import * as S from './styles';

export interface WhiteButtonProps extends S.ContainerProps {
  icon?: SvgIconTypes.Icon | null;
  variant: ButtonVariant.WHITE;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

const WhiteButton = React.forwardRef<HTMLButtonElement, WhiteButtonProps>(({ icon, children, iconProps, ...props }, ref) => (
  <S.Container ref={ref} {...props}>
    {children && <S.Label>{children}</S.Label>}
    {icon && <S.Icon icon={icon} size={16} {...iconProps} />}
  </S.Container>
));

export default Object.assign(WhiteButton, {
  Icon: S.Icon,
  Label: S.Label,
  Container: S.Container,
});
