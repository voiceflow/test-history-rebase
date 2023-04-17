import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

import { useSwallowZoom } from '../hooks';
import CircularHandle from './CircularHandle';

const OffsetCircularHandle = styled(CircularHandle)`
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
`;

export interface RotateHandleProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
}

const RotateHandle: React.FC<RotateHandleProps> = ({ onDragStart }) => {
  const ref = useSwallowZoom<HTMLDivElement>();

  return <OffsetCircularHandle draggable onMouseDown={stopPropagation()} onDragStart={onDragStart} ref={ref} />;
};

export default RotateHandle;
