import React from 'react';

export interface AreaChartGradientProps {
  color: string;
  id: string;
}

const AreaChartGradient: React.FC<AreaChartGradientProps> = ({ color, id }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={color} stopOpacity={1} />
    <stop offset="100%" stopColor={color} stopOpacity={0} />
  </linearGradient>
);

export default AreaChartGradient;
