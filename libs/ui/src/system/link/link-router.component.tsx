import React from 'react';

import { forwardRef } from '@/hocs/forwardRef';

import type * as I from './link.interface';
import * as S from './link.style';
import * as U from './link.utils';

export const Router = forwardRef<HTMLAnchorElement, I.LinkRouterProps>('SystemLinkRouter', (props, ref) => (
  <S.Router {...props} {...U.propsToStyled(props)} ref={ref} />
));
