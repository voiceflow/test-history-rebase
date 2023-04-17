import React from 'react';

import * as I from './snackbar.interface';
import * as S from './snackbar.style';

export const Base: React.FC<I.BaseProps> = ({ children, ...props }) => (
  <S.Container>
    <S.Content {...props}>{children}</S.Content>
  </S.Container>
);
