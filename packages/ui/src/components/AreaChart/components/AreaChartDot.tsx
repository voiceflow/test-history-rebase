import _isNumber from 'lodash/isNumber';
import React from 'react';

export interface AreaChartDotProps {
  stroke?: string;
  cx?: number;
  cy?: number;
}

const AreaChartDot: React.FC<AreaChartDotProps> = ({ stroke, cx, cy }) => {
  if (!_isNumber(cx) || !_isNumber(cy)) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r="5" stroke={stroke} strokeWidth={2} strokeOpacity={0.3} fillOpacity={0} />
      <circle cx={cx} cy={cy} r="3" fill="white" stroke={stroke} strokeWidth={2} />
    </g>
  );
};

export default AreaChartDot;
