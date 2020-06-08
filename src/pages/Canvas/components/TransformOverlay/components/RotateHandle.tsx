import React from 'react';

import { stopPropagation } from '@/utils/dom';

import { useSwallowZoom } from '../hooks';
import CircularHandle from './CircularHandle';

export type RotateHandleProps = {
  onDragStart: () => void;
};

const RotateHandle: React.FC<RotateHandleProps> = ({ onDragStart }) => {
  const ref = useSwallowZoom<HTMLDivElement>();

  return <CircularHandle draggable onMouseDown={stopPropagation()} onDragStart={onDragStart} ref={ref} />;
};

export default RotateHandle;
