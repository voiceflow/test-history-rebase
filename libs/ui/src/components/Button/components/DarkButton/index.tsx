import React from 'react';

import type { ButtonVariant } from '@/components/Button/constants';
import SvgIcon from '@/components/SvgIcon';

import type { CommonButtonProps } from '../types';
import * as S from './styles';

export type DarkButtonProps = S.DarkButtonContainerProps & CommonButtonProps<ButtonVariant.PRIMARY>;

const DarkButton = React.forwardRef<HTMLDivElement, DarkButtonProps>(({ icon, children, iconProps, ...props }, ref) => (
  <S.DarkButtonContainer ref={ref} {...props}>
    {children}

    {icon && (
      <S.DarkButtonIcon>
        <SvgIcon icon={icon} color="#FFF" size={16} {...iconProps} />
      </S.DarkButtonIcon>
    )}
  </S.DarkButtonContainer>
));

export default DarkButton;
