import React from 'react';

import ChartTooltip from '@/components/ChartTooltip';

import type { AreaChartDatum, DatumFormatter } from '../types';

export interface AreaChartTooltipProps {
  formatX: DatumFormatter;
  formatY: DatumFormatter;
  payload?: { payload: AreaChartDatum }[];
}

const AreaChartTooltip: React.FC<AreaChartTooltipProps> = ({ formatX, formatY, payload }) => {
  if (!payload || !payload.length) return null;

  const [{ payload: data }] = payload;

  return <ChartTooltip label={formatX(data.x)} value={formatY(data.y)} />;
};

export default AreaChartTooltip;
