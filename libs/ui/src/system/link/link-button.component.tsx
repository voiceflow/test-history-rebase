import { forwardRef } from '@ui/hocs/forwardRef';
import React from 'react';

import type * as I from './link.interface';
import * as S from './link.style';
import * as U from './link.utils';

export const Button = forwardRef<HTMLButtonElement, I.ButtonProps>('SystemLinkButton', (props, ref) => (
  <S.Button {...U.propsToStyled(props)} ref={ref} />
));
