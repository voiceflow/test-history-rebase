import React from 'react';

import * as S from './styles';

export interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const TextButton: React.ForwardRefRenderFunction<HTMLButtonElement, TextButtonProps> = (
  { children, ...props },
  ref
) => (
  <S.TextButtonContainer ref={ref} type="button" {...props}>
    {children}
  </S.TextButtonContainer>
);

export default React.forwardRef<HTMLButtonElement, TextButtonProps>(TextButton);
