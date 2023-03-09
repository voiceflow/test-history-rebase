import _isNumber from 'lodash/isNumber';
import React from 'react';

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
      <rect x={x} y={y} rx={3} ry={3} height={height} width={width} fill={fill} />
      <path
        d={`M${x},${y + height - 3}
            A 3 3, 0, 0, 0, ${x + 3} ${y + height}
            L ${x + width - 3} ${y + height}
            A 3 3, 0, 0, 0, ${x + width} ${y + height - 3}
            Z `}
        fill="rgba(0,0,0,0.16)"
      />
    </g>
  );
};

export default BarChartBar;
