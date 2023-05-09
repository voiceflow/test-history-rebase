import { useCreateConst } from '@ui/hooks';
import { abbreviateNumber } from '@ui/utils/format';
import { Utils } from '@voiceflow/common';
import React from 'react';
import { Area, AreaChart as ReAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { AreaChartDot, AreaChartGradient, AreaChartTick, AreaChartTooltip } from './components';
import { MonthlyDateFormatter, SimpleFormatter, WeeklyDateFormatter, YearlyDateFormatter } from './formatters';
import { AreaChartDatum, AreaChartFormatter } from './types';
import { getMaxY } from './utils';

export * from './types';

export interface AreaChartProps {
  data: AreaChartDatum[];
  color?: string;
  formatter?: AreaChartFormatter;

  /* grid */
  withGrid?: boolean;

  /* axes */
  withAxes?: boolean;
  axisWidth?: number;

  /* tooltip */
  withTooltip?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  color = '#5b9fd7',
  withGrid = false,
  withAxes = false,
  axisWidth = 40,
  withTooltip = false,
  formatter = SimpleFormatter,
}) => {
  const gradientID = useCreateConst(() => `area-chart-gradient-${Utils.id.cuid.slug()}`);
  const maxY = getMaxY(data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReAreaChart data={data} margin={{ top: 5, bottom: 0, right: 6, left: 0 }}>
        <defs>
          <AreaChartGradient id={gradientID} color={color} />
        </defs>
        {withGrid && <CartesianGrid vertical={false} stroke="#eaeff4" strokeDasharray="4" strokeLinecap="round" />}
        <YAxis
          type="number"
          scale="linear"
          domain={[0, maxY]}
          interval={0}
          width={axisWidth}
          ticks={formatter.axes.ticksY?.(0, maxY)}
          tickFormatter={abbreviateNumber}
          hide={!withAxes}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#8da2b5', fontSize: '13px' }}
          dx={-4}
        />
        {withAxes && (
          <XAxis
            dataKey="x"
            type="number"
            axisLine={false}
            height={25}
            tickLine={false}
            domain={[data[0].x, data[data.length - 1].x]}
            tickFormatter={formatter.axes.formatX}
            ticks={formatter.axes.ticksX?.(data)}
            tick={<AreaChartTick formatter={formatter} axisWidth={axisWidth} />}
          />
        )}
        {withTooltip && (
          <Tooltip
            content={<AreaChartTooltip formatX={formatter.tooltip.formatX} formatY={formatter.tooltip.formatY ?? String} />}
            cursor={{ stroke: '#dfe3ed' }}
          />
        )}
        <Area dataKey="y" stroke={color} strokeWidth={2} fill={`url(#${gradientID})`} fillOpacity={0.2} activeDot={<AreaChartDot stroke={color} />} />
      </ReAreaChart>
    </ResponsiveContainer>
  );
};

export default Object.assign(AreaChart, {
  SimpleFormatter,
  WeeklyDateFormatter,
  MonthlyDateFormatter,
  YearlyDateFormatter,
});
