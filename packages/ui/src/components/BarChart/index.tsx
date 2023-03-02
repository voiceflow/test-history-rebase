import { useCreateConst } from '@ui/hooks';
import { abbreviateNumber } from '@ui/utils/format';
import { Utils } from '@voiceflow/common';
import React from 'react';
import * as Recharts from 'recharts';

import { BarChartGradient, BarChartTooltip } from './components';
import { COLORS } from './constants';
import { BarChartColor, BarChartDatum } from './types';

export * from './types';

const STACK_ID = 'bar-chart-stack';

export interface BarChartProps {
  data: BarChartDatum[];
  onClick?: (data: any, index: number) => void;

  /* bars */
  barThickness?: number;
  barRadius?: number;
  barStackGap?: number;
  barColors?: BarChartColor[];

  /* labels */
  withLabels?: boolean;

  /* tooltip */
  withTooltip?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  onClick,
  barThickness = 12,
  barRadius = 2,
  barStackGap = 1,
  barColors = COLORS,
  withLabels = false,
  withTooltip = false,
}) => {
  const sorted = React.useMemo(
    () =>
      [...data]
        .sort((lhs, rhs) => rhs.primary - lhs.primary)
        .map((data) => ({
          ...data,
          empty: 0,
          total: data.primary + data.secondary,
        })),
    [data]
  );
  const getGradientID = useCreateConst(() => {
    const slug = Utils.id.cuid.slug();
    return (index: number) => `bar-chart-gradient-${slug}-${index}`;
  });

  return (
    <Recharts.ResponsiveContainer width="100%" height="100%">
      <Recharts.BarChart
        data={sorted}
        layout="vertical"
        barGap={42}
        barSize={barThickness}
        barCategoryGap={barStackGap}
        margin={{ top: 30, bottom: 20 }}
      >
        <defs>
          {barColors.map((color, index) => (
            <BarChartGradient key={index} id={getGradientID(index)} color1={color.light} color2={color.lighter} />
          ))}
        </defs>
        <Recharts.YAxis hide dataKey="label" type="category" padding={{ top: 0, bottom: 0 }} />
        <Recharts.XAxis hide axisLine={false} type="number" />
        {withTooltip && <Recharts.Tooltip cursor={false} content={<BarChartTooltip />} />}
        <Recharts.Bar dataKey="primary" stackId={STACK_ID} radius={barRadius} cursor="pointer" onClick={onClick}>
          {withLabels && (
            <Recharts.LabelList
              dataKey="label"
              position="insideBottomLeft"
              strokeWidth={0}
              width={200}
              fill="#949db0"
              fontFamily="'Open Sans', sans-serif"
              fontWeight={600}
              fontSize="13px"
              dy={-barThickness}
              cursor="pointer"
            />
          )}
          {sorted.map((datum, index) => (
            <Recharts.Cell key={datum.label} fill={barColors[index % barColors.length].primary} />
          ))}
        </Recharts.Bar>
        <Recharts.Bar dataKey="secondary" stackId={STACK_ID} radius={barRadius} style={{ transform: `translate(${barStackGap}px,0)` }}>
          {sorted.map((datum, index) => (
            <Recharts.Cell key={datum.label} fill={`url(#${getGradientID(index % barColors.length)})`} />
          ))}
        </Recharts.Bar>
        {withLabels && (
          <Recharts.Bar dataKey="empty" stackId={STACK_ID} isAnimationActive={false}>
            <Recharts.LabelList
              dataKey="total"
              position="right"
              formatter={abbreviateNumber}
              strokeWidth={0}
              fontFamily="'Open Sans', sans-serif"
              fontWeight={600}
              fontSize="13px"
              dx={barStackGap}
            />
            {sorted.map((datum, index) => (
              <Recharts.Cell key={datum.label} fill={barColors[index % barColors.length].primary} />
            ))}
          </Recharts.Bar>
        )}
      </Recharts.BarChart>
    </Recharts.ResponsiveContainer>
  );
};

export default BarChart;
