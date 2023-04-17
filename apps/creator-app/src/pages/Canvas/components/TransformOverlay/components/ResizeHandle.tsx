import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { useSwallowZoom } from '../hooks';
import LineHandle from './LineHandle';
import SquareHandle, { SquareHandleProps } from './SquareHandle';

export type ResizeHandleProps = SquareHandleProps & {
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ position, onDragStart }) => {
  const squareRef = useSwallowZoom<HTMLDivElement>();
  const lineEndRef = useSwallowZoom<HTMLDivElement>();
  const lineStartRef = useSwallowZoom<HTMLDivElement>();

  return (
    <>
      <LineHandle edge="start" position={position} draggable onMouseDown={stopPropagation()} onDragStart={onDragStart} ref={lineStartRef} />
      <SquareHandle position={position} draggable onMouseDown={stopPropagation()} onDragStart={onDragStart} ref={squareRef} />
      <LineHandle edge="end" position={position} draggable onMouseDown={stopPropagation()} onDragStart={onDragStart} ref={lineEndRef} />
    </>
  );
};

export default ResizeHandle;
