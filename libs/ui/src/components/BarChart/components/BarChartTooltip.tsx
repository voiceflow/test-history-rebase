import React from 'react';

import ChartTooltip from '@/components/ChartTooltip';

import type { BarChartDatum } from '../types';

const BarChartTooltip = ({ payload }: { payload?: { payload: BarChartDatum }[] }) => {
  if (!payload || !payload.length) return null;

  const [{ payload: data }] = payload;

  return <ChartTooltip label={data.label} value={(data.primary + data.secondary).toLocaleString()} />;
};

export default BarChartTooltip;
