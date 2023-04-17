import { ButtonVariant } from '@ui/components/Button/constants';
import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import { CommonButtonProps } from '../types';
import * as S from './styles';

export type SecondaryButtonProps = S.SecondaryButtonContainerProps &
  CommonButtonProps<ButtonVariant.SECONDARY> &
  Omit<S.SecondaryButtonIconProps, 'withoutChildren'>;

const SecondaryButton = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<SecondaryButtonProps>>(
  ({ icon, children, iconProps, center, ...props }, ref) => (
    <S.SecondaryButtonContainer {...props} ref={ref}>
      {icon && (
        <S.SecondaryButtonIcon withoutChildren={!children} center={center}>
          <SvgIcon icon={icon} {...iconProps} />
        </S.SecondaryButtonIcon>
      )}

      {children}
    </S.SecondaryButtonContainer>
  )
);

export default SecondaryButton;
