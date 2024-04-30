import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { forwardRef } from '@/hocs/forwardRef';

import * as E from './icon-button.enum';
import type * as I from './icon-button.interface';
import * as S from './icon-button.style';

export const Base = forwardRef<HTMLButtonElement, I.Props>(
  'SystemIconButton',
  (
    {
      icon,
      size = E.Size.M,
      active = false,
      children,
      hoverBackground = true,
      activeBackground = true,
      iconProps,
      ...props
    },
    ref
  ) => (
    <S.Container
      ref={ref}
      $size={size}
      $active={active}
      $hoverBackground={hoverBackground}
      $activeBackground={activeBackground}
      {...props}
    >
      {icon && <SvgIcon icon={icon} size={16} {...iconProps} />}
      {children}
    </S.Container>
  )
);
