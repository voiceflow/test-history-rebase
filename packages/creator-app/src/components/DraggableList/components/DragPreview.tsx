import React from 'react';

import { useDragPreview } from '@/hooks';

import { DnDHandlers } from '../types';
import DragPreviewWrapper from './DragPreviewWrapper';

export interface DragPreviewComponentProps {
  isDraggingPreview?: boolean;
}

export interface DragPreviewProps<P extends {}> {
  type: string;
  handlers: { current: DnDHandlers<any> };
  component: React.FC<P & DragPreviewComponentProps>;
}

const DragPreview = <P extends {}>({ type, component: Preview, handlers }: DragPreviewProps<P>) => {
  useDragPreview<P>(type, ({ getStyle, ...props }) => (
    <DragPreviewWrapper style={getStyle()} deleteHovered={handlers.current.deleteHovered}>
      <Preview {...(props as P)} isDraggingPreview />
    </DragPreviewWrapper>
  ));

  return null;
};

export default React.memo(DragPreview) as <P extends {}>(props: DragPreviewProps<P>) => JSX.Element;
