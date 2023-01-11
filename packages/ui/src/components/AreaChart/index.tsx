import { useCreateConst } from '@ui/hooks';
import { abbreviateNumber } from '@ui/utils/format';
import { Utils } from '@voiceflow/common';
import React from 'react';
import * as Recharts from 'recharts';

import { AreaChartGradient, AreaChartTick, AreaChartTooltip } from './components';
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

  /* tooltip */
  withTooltip?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  color = '#5b9fd7',
  withGrid = false,
  withAxes = false,
  withTooltip = false,
  formatter = SimpleFormatter,
}) => {
  const gradientID = useCreateConst(() => `area-chart-gradient-${Utils.id.cuid.slug()}`);
  const maxY = getMaxY(data);

  return (
    <Recharts.ResponsiveContainer width="100%" height="100%">
      <Recharts.AreaChart data={data}>
        <defs>
          <AreaChartGradient id={gradientID} color={color} />
        </defs>
        {withGrid && <Recharts.CartesianGrid vertical={false} stroke="#eaeff4" strokeDasharray="4" strokeLinecap="round" />}
        <Recharts.YAxis
          type="number"
          scale="linear"
          domain={[0, maxY]}
          interval={0}
          ticks={formatter.axes.ticksY?.(0, maxY)}
          tickFormatter={abbreviateNumber}
          hide={!withAxes}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#8da2b5' }}
        />
        {withAxes && (
          <Recharts.XAxis
            dataKey="x"
            type="number"
            axisLine={false}
            tickLine={false}
            domain={[data[0].x, data[data.length - 1].x]}
            tickFormatter={formatter.axes.formatX}
            ticks={formatter.axes.ticksX?.(data)}
            tick={<AreaChartTick formatter={formatter} />}
          />
        )}
        {withTooltip && (
          <Recharts.Tooltip
            cursor={{ stroke: '#dfe3ed', strokeWidth: 1 }}
            content={<AreaChartTooltip formatX={formatter.tooltip.formatX} formatY={String} />}
          />
        )}
        <Recharts.Area dataKey="y" stroke={color} strokeWidth={2} fill={`url(#${gradientID})`} fillOpacity={0.2} />
      </Recharts.AreaChart>
    </Recharts.ResponsiveContainer>
  );
};

export default Object.assign(AreaChart, {
  SimpleFormatter,
  WeeklyDateFormatter,
  MonthlyDateFormatter,
  YearlyDateFormatter,
});
