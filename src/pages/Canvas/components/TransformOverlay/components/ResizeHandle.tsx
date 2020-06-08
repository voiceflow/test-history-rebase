import React from 'react';

import { stopPropagation } from '@/utils/dom';

import { useSwallowZoom } from '../hooks';
import SquareHandle, { SquareHandleProps } from './SquareHandle';

export type ResizeHandleProps = SquareHandleProps & {
  onDragStart: () => void;
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({ position, onDragStart }) => {
  const ref = useSwallowZoom<HTMLDivElement>();

  return <SquareHandle position={position} draggable onMouseDown={stopPropagation()} onDragStart={onDragStart} ref={ref} />;
};

export default ResizeHandle;
