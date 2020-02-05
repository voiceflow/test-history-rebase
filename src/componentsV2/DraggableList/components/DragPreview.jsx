import React from 'react';

import { css, styled, transition } from '@/hocs';
import { useDragPreview } from '@/hooks';

const DragPreviewWrapper = styled.div`
  z-index: 10000000;
  pointer-events: none;
  transform: scale(1);
  ${transition('transform')};

  ${({ deleteHovered }) =>
    deleteHovered &&
    css`
      transform: scale(0.8);
    `}
`;

const DragPreview = ({ type, component: Preview, options, handlers }) => {
  useDragPreview(
    type,
    ({ getStyle, ...props }) => (
      <DragPreviewWrapper style={getStyle()} deleteHovered={handlers.current.deleteHovered}>
        <Preview {...props} isDraggingPreview />
      </DragPreviewWrapper>
    ),
    options
  );

  return null;
};

export default React.memo(DragPreview);
