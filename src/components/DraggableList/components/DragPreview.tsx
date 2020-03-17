import React from 'react';

import { useDragPreview } from '@/hooks';

import { Handlers } from '../types';
import DragPreviewWrapper from './DragPreviewWrapper';

export type DragPreviewProps = {
  type: string;
  options: any;
  handlers: { current: Handlers };
  component: React.FC<{ isDraggingPreview: boolean; [key: string]: any }>;
};

const DragPreview: React.FC<DragPreviewProps> = ({ type, component: Preview, options, handlers }) => {
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
