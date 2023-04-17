import _isNumber from 'lodash/isNumber';
import React from 'react';

import { BAR_RADIUS, BAR_SHADOW_HEIGHT } from '../constants';

export interface BarChartBarProps {
  x?: number;
  y?: number;
  fill?: string;
  width?: number;
  height?: number;
}

const BarChartBar: React.FC<BarChartBarProps> = ({ x, y, fill, width, height }) => {
  if (!_isNumber(width) || !_isNumber(height) || !_isNumber(y) || !_isNumber(x)) return null;

  return (
    <g>
      <rect x={x} y={y} rx={BAR_RADIUS} ry={BAR_RADIUS} height={height} width={width} fill={fill} />
      <path
        d={`M ${x}, ${y + height - BAR_SHADOW_HEIGHT}
            A ${BAR_RADIUS} ${BAR_RADIUS}, 0, 0, 0, ${x + BAR_RADIUS}, ${y + height}
            H ${x + width - BAR_RADIUS}
            A ${BAR_RADIUS} ${BAR_RADIUS}, 0, 0, 0, ${x + width}, ${y + height - BAR_SHADOW_HEIGHT}
            H ${x}`}
        fill="rgba(0,0,0,0.16)"
      />
    </g>
  );
};

export default BarChartBar;
