import React from 'react';

import { STROKE_DEFAULT_COLOR } from '../constants';
import { getHighlightedStrokeColor } from './LinkPath';

export type LinkHeadMarkerProps = {
  id?: string;
  refX?: string;
  color?: string;
  orient?: string;
  isHighlighted?: boolean;
};

const LinkHeadMarker: React.ForwardRefRenderFunction<SVGMarkerElement, LinkHeadMarkerProps> = (
  { id, refX = '8', orient, isHighlighted, color = STROKE_DEFAULT_COLOR },
  ref
) => (
  <marker
    id={id ? `head-${id}` : 'head'}
    ref={ref}
    refX={refX}
    refY="4"
    orient={orient}
    viewBox="0 0 20 20"
    markerUnits="userSpaceOnUse"
    markerWidth="20"
    markerHeight="20"
  >
    <path
      d="M7.07138888,5.50174526 L2.43017246,7.82235347 C1.60067988,8.23709976 0.592024983,7.90088146 0.177278692,7.07138888 C0.0606951226,6.83822174 0,6.58111307 0,6.32042429 L0,1.67920787 C0,0.751806973 0.751806973,0 1.67920787,0 C1.93989666,0 2.19700532,0.0606951226 2.43017246,0.177278692 L7,3 C7.82949258,3.41474629 8.23709976,3.92128809 7.82235347,4.75078067 C7.6598671,5.07575341 7.39636161,5.33925889 7.07138888,5.50174526 Z"
      fill={isHighlighted ? getHighlightedStrokeColor({ strokeColor: color }) : color}
    ></path>
  </marker>
);

export default React.forwardRef(LinkHeadMarker);
