import React from 'react';

import { styled } from '@/hocs';
import { stopPropagation } from '@/utils/dom';

import { useSwallowZoom } from '../hooks';
import CircularHandle from './CircularHandle';

const OffsetCircularHandle = styled(CircularHandle)`
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
`;

export type RotateHandleProps = {
  onDragStart: () => void;
};

const RotateHandle: React.FC<RotateHandleProps> = ({ onDragStart }) => {
  const ref = useSwallowZoom<HTMLDivElement>();

  return <OffsetCircularHandle draggable onMouseDown={stopPropagation()} onDragStart={onDragStart} ref={ref} />;
};

export default RotateHandle;
