import SvgIcon from '@ui/components/SvgIcon';
import { forwardRef } from '@ui/hocs/forwardRef';
import React from 'react';

import * as E from './icon-button.enum';
import * as I from './icon-button.interface';
import * as S from './icon-button.style';

export const Base = forwardRef<HTMLButtonElement, I.Props>(
  'SystemIconButton',
  ({ icon, size = E.Size.M, active = false, children, hoverBackground = true, activeBackground = true, iconProps, ...props }, ref) => (
    <S.Container ref={ref} $size={size} $active={active} $hoverBackground={hoverBackground} $activeBackground={activeBackground} {...props}>
      {icon && <SvgIcon icon={icon} size={16} {...iconProps} />}
      {children}
    </S.Container>
  )
);
