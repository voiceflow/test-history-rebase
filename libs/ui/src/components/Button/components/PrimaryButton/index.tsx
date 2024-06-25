import type { ButtonVariant } from '@ui/components/Button/constants';
import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

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
