import React from 'react';

import { MarkupLineInstance } from '@/pages/Canvas/components/MarkupNode/types';
import { getRotation } from '@/utils/math';

import ArrowHead from './ArrowHead';
import LinePath from './LinePath';

export type LineProps = {
  id: string;
  isArrow: boolean;
  color: string;
  offsetX: number;
  offsetY: number;
};

const Line: React.ForwardRefRenderFunction<MarkupLineInstance, LineProps> = ({ id, isArrow, color, offsetX, offsetY }, ref) => {
  const headRef = React.useRef<SVGMarkerElement>(null);
  const lineRef = React.useRef<SVGLineElement>(null);
  const rotate = getRotation(offsetY, offsetX);

  React.useImperativeHandle(
    ref,
    () => ({
      setLineAttribute: (key, value) => lineRef.current?.setAttribute(key, value),
      setHeadAttribute: (key, value) => headRef.current?.setAttribute(key, value),
    }),
    []
  );

  return (
    <>
      <defs>
        {isArrow && <ArrowHead id={id} color={color} rotate={rotate} ref={headRef} />}
        <LinePath id={`path-${id}`} ref={lineRef} markerEnd={`url(#head-${id})`} endX={offsetX} endY={offsetY} />
        <g id={`line-${id}`}>
          <use xlinkHref={`#path-${id}`} stroke="transparent" strokeWidth="20" />
          <use xlinkHref={`#path-${id}`} />
        </g>
      </defs>
      <use xlinkHref={`#line-${id}`} strokeWidth="1" stroke={color} />
    </>
  );
};

export default React.forwardRef(Line);
