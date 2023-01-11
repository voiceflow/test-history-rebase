import React from 'react';

import { AreaChartDatum, AreaChartFormatter } from '../types';

export interface AreaChartTickProps {
  x?: number;
  y?: number;
  formatter: AreaChartFormatter;
  payload?: {
    value: AreaChartDatum['x'];
  };
}

const AreaChartTick: React.FC<AreaChartTickProps> = ({ x, y, payload, formatter }) => (
  <g transform={`translate(${x},${y})`}>
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

export default AreaChartTick;
