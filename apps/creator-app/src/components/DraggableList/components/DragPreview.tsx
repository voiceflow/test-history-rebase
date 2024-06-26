import React from 'react';

import type { DragPreviewOptions } from '@/hooks/dnd.hook';
import { useDragPreview } from '@/hooks/dnd.hook';

import type { DnDHandlers } from '../types';
import DragPreviewWrapper from './DragPreviewWrapper';

export interface DragPreviewComponentProps {
  isDraggingPreview?: boolean;
  isDraggingXEnabled?: boolean;
}

export interface DragPreviewProps<P> {
  type: string;
  options?: DragPreviewOptions;
  handlers: { current: DnDHandlers<any> };
  component: React.FC<P & DragPreviewComponentProps>;
}

const DragPreview = <P,>({ type, component: Preview, options, handlers }: DragPreviewProps<P>) => {
  useDragPreview<P>(
    type,
    ({ getStyle, ...props }) => (
      <DragPreviewWrapper style={getStyle()} deleteHovered={handlers.current.deleteHovered}>
        <Preview {...(props as P)} isDraggingPreview />
      </DragPreviewWrapper>
    ),
    options
  );

  return null;
};

export default React.memo(DragPreview) as <P>(props: DragPreviewProps<P>) => JSX.Element;
