import { forwardRef } from '@ui/hocs/forwardRef';
import React from 'react';

import type * as I from './link.interface';
import * as S from './link.style';
import * as U from './link.utils';

export const Anchor = forwardRef<HTMLAnchorElement, I.AnchorProps>(
  'SystemLinkAnchor',
  ({ rel = 'noopener noreferrer', href, target = '_blank', children, ...props }, ref) => (
    <S.Anchor {...U.propsToStyled(props)} ref={ref} rel={rel} href={U.formatHref(href, target)} target={target}>
      {children}
    </S.Anchor>
  )
);
