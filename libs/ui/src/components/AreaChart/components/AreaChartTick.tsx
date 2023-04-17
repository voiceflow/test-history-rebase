import _isNumber from 'lodash/isNumber';
import React from 'react';

import { AreaChartDatum, AreaChartFormatter } from '../types';

export interface AreaChartTickProps {
  axisWidth?: number;
  x?: number;
  y?: number;
  formatter: AreaChartFormatter;
  payload?: {
    value: AreaChartDatum['x'];
  };
}

const AreaChartTick: React.FC<AreaChartTickProps> = ({ axisWidth, x, y, payload, formatter }) => {
  if (!_isNumber(x) || !_isNumber(y)) return null;

  return (
    <g transform={`translate(${x === axisWidth ? x + 16 : x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fontSize={13}
        fontFamily="'Open Sans', sans-serif"
        fill="#8da2b5"
        {...(payload?.value && formatter.axes.styleX?.(payload.value))}
      >
        {formatter.axes.formatX(payload?.value ?? '')}
      </text>
    </g>
  );
};

export default AreaChartTick;
