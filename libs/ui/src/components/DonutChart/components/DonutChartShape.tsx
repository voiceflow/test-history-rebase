import _isNumber from 'lodash/isNumber';
import React from 'react';
import { Sector } from 'recharts';

import type { DonutChartDatum } from '../types';

export interface DonutChartShapeProps {
  cx?: number;
  cy?: number;
  startAngle?: number;
  endAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  fill?: string;
  shadowRadius: number;
  shadowColor: string;
  isActive?: boolean;
  payload?: DonutChartDatum;
}

const DonutChartShape: React.FC<DonutChartShapeProps> = ({
  cx,
  cy,
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
  shadowRadius,
  shadowColor,
  isActive,
  payload,
}) => {
  if (
    !_isNumber(cx) ||
    !_isNumber(cy) ||
    !_isNumber(startAngle) ||
    !_isNumber(endAngle) ||
    !_isNumber(innerRadius) ||
    !_isNumber(outerRadius)
  )
    return null;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload?.color}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={innerRadius + shadowRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={shadowColor}
        stroke="transparent"
      />
      {isActive && (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={payload?.color}
          fillOpacity={0.1}
        />
      )}
    </g>
  );
};

export default DonutChartShape;
