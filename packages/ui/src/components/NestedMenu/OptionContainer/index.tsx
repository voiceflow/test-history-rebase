import React from 'react';
import { Popper, PopperProps } from 'react-popper';

import Portal from '../../Portal';

export interface NestedMenuOptionContainerProps {
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
        <div ref={ref} style={style} data-placement={parentPlacement}>
          {children}
        </div>
      )}
    </Popper>
  </Portal>
);

export default NestedMenuOptionContainer;
