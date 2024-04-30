import React from 'react';

import type { ButtonVariant } from '@/components/Button/constants';
import SvgIcon from '@/components/SvgIcon';

import type { CommonButtonProps } from '../types';
import * as S from './styles';

export type PrimaryButtonProps = S.PrimaryButtonContainerProps & CommonButtonProps<ButtonVariant.PRIMARY>;

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ icon, children, iconProps, isLoading, ...props }, ref) => (
    <S.PrimaryButtonContainer ref={ref} {...props}>
      <S.PrimaryButtonLabel isLoading={isLoading}>{children}</S.PrimaryButtonLabel>

      {icon && (
        <S.PrimaryButtonIcon>
          <SvgIcon icon={icon} color="#FFF" size={16} {...iconProps} />
        </S.PrimaryButtonIcon>
      )}
    </S.PrimaryButtonContainer>
  )
);

export default Object.assign(PrimaryButton, {
  Icon: S.PrimaryButtonIcon,
  Label: S.PrimaryButtonLabel,
  Container: S.PrimaryButtonContainer,
});
