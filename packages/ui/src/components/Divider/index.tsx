import React from 'react';

import * as S from './styles';
import * as T from './types';

export * as DividerTypes from './types';

interface DividerProps extends Omit<T.SimpleProps, 'theme'>, T.LabeledHorizontalProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(({ children, ...props }, ref) =>
  children ? (
    <S.LabeledHorizontal ref={ref} {...props}>
      {children}
    </S.LabeledHorizontal>
  ) : (
    <S.Simple ref={ref} {...props} />
  )
);

export default Object.assign(Divider, { S });
