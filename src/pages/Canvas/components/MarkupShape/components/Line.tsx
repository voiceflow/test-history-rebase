import React from 'react';

import { getRotation } from '@/utils/math';

import ArrowHead from './ArrowHead';
import LinePath from './LinePath';

export type LineProps = {
  id: string;
  isArrow: boolean;
  color: string;
  offsetX: number;
  offsetY: number;
  headRef?: React.RefObject<SVGMarkerElement>;
};

const Line: React.RefForwardingComponent<SVGLineElement, LineProps> = ({ id, isArrow, color, offsetX, offsetY, headRef }, ref) => {
  const rotate = getRotation(offsetY, offsetX);

  return (
    <g>
      {isArrow && <ArrowHead id={id} color={color} rotate={rotate} ref={headRef} />}
      <LinePath ref={ref} markerEnd={`url(#head-${id})`} color={color} endX={offsetX} endY={offsetY} />
    </g>
  );
};

export default React.forwardRef(Line);
