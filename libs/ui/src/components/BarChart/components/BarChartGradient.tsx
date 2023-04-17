import React from 'react';

export interface BarChartGradientProps {
  id: string;
  color1: string;
  color2: string;
}

const BarChartGradient: React.FC<BarChartGradientProps> = ({ id, color1, color2 }) => (
  <pattern id={id} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
    <line x1={0} y={0} x2={0} y2={16} stroke={color1} strokeWidth={16} />
    <line x1={16} y={0} x2={16} y2={16} stroke={color2} strokeWidth={16} />
  </pattern>
);

export default BarChartGradient;
