import React from 'react';

import type { ButtonVariant } from '../../constants';
import type { CommonButtonProps } from '../types';
import * as S from './styles';

export type WhiteButtonProps = S.ContainerProps & CommonButtonProps<ButtonVariant.WHITE>;

const WhiteButton = React.forwardRef<HTMLButtonElement, WhiteButtonProps>(
  ({ icon, children, iconProps, ...props }, ref) => (
    <S.Container ref={ref} {...props}>
      {children && <S.Label>{children}</S.Label>}
      {icon && <S.Icon icon={icon} size={16} {...iconProps} />}
    </S.Container>
  )
);

export default Object.assign(WhiteButton, {
  Icon: S.Icon,
  Label: S.Label,
  Container: S.Container,
});
