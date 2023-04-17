import ChartTooltip from '@ui/components/ChartTooltip';
import React from 'react';

import { BarChartDatum } from '../types';

const BarChartTooltip = ({ payload }: { payload?: { payload: BarChartDatum }[] }) => {
  if (!payload || !payload.length) return null;

  const [{ payload: data }] = payload;

  return <ChartTooltip label={data.label} value={(data.primary + data.secondary).toLocaleString()} />;
};

export default BarChartTooltip;
