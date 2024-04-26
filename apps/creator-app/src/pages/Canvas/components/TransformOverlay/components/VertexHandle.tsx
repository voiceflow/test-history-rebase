import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs/styled';
import { EngineContext } from '@/pages/Canvas/contexts';
import type { Point } from '@/types';

import { useSwallowZoom } from '../hooks';
import CircularHandle from './CircularHandle';

interface VertexCircularHandleProps {
  point: Point;
}

const VertexCircularHandle = styled(CircularHandle)<VertexCircularHandleProps>`
  position: fixed;
  transform: translate(-50%, -50%);

  ${({ point: [left, top] }) => css`
    left: ${left}px;
    top: ${top}px;
  `}
`;

export type VertexHandleProps = VertexCircularHandleProps & {
  onDragStart: () => void;
};

const VertexHandle: React.FC<VertexHandleProps> = ({ point: [left, right], onDragStart }) => {
  const ref = useSwallowZoom<HTMLDivElement>();
  const engine = React.useContext(EngineContext)!;
  const zoom = engine.canvas!.getZoom();

  return (
    <VertexCircularHandle
      draggable
      point={[left * zoom, right * zoom]}
      onMouseDown={stopPropagation()}
      onDragStart={onDragStart}
      ref={ref}
    />
  );
};

export default VertexHandle;
