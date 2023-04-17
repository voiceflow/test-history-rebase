import React from 'react';
import { Popper, PopperProps } from 'react-popper';

import Portal from '../../Portal';
import * as S from './styles';

export interface NestedMenuOptionContainerProps extends React.PropsWithChildren {
  placement?: PopperProps['placement'];
}

const NestedMenuOptionContainer: React.FC<NestedMenuOptionContainerProps> = ({ children, placement = 'right-start' }) => (
  <Portal portalNode={document.body}>
    <Popper
      placement={placement}
      modifiers={{
        isRoot: { value: false },
        preventOverflow: { boundariesElement: document.body, padding: 16 },
      }}
    >
      {({ ref, style, placement: parentPlacement }) => (
        <S.Container ref={ref} style={style} data-placement={parentPlacement}>
          {children}
        </S.Container>
      )}
    </Popper>
  </Portal>
);

export default NestedMenuOptionContainer;
