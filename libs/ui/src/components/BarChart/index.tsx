import { Utils } from '@voiceflow/common';
import React from 'react';
import { Bar, BarChart as ReBarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useCreateConst } from '@/hooks';
import { abbreviateNumber } from '@/utils/format';

import { BarChartBar, BarChartGradient, BarChartTooltip } from './components';
import { COLORS } from './constants';
import type { BarChartColor, BarChartDatum } from './types';

export * from './types';

const STACK_ID = 'bar-chart-stack';

export interface BarChartProps {
  data: BarChartDatum[] | null;
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
  testID?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  onClick,
  barThickness = 12,
  barRadius = 3,
  barStackGap = 1,
  barColors = COLORS,
  withLabels = true,
  withTooltip = false,
  testID,
}) => {
  const getGradientID = useCreateConst(() => {
    const slug = Utils.id.cuid.slug();
    return (index: number) => `bar-chart-gradient-${slug}-${index}`;
  });

  if (!data) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart
        data={data}
        layout="vertical"
        barGap={42}
        barSize={barThickness}
        barCategoryGap={barStackGap}
        margin={{ top: 0, bottom: 0, right: 30, left: 0 }}
      >
        <defs>
          {barColors.map((color, index) => (
            <BarChartGradient key={index} id={getGradientID(index)} color1={color.light} color2={color.lighter} />
          ))}
        </defs>
        <YAxis hide dataKey="label" type="category" />
        <XAxis hide axisLine={false} type="number" />
        {withTooltip && <Tooltip cursor={false} content={<BarChartTooltip />} />}
        <Bar
          dataKey="primary"
          stackId={STACK_ID}
          radius={barRadius}
          cursor="pointer"
          onClick={onClick}
          shape={<BarChartBar />}
        >
          {withLabels && (
            <LabelList
              dataKey="label"
              position="insideBottomLeft"
              strokeWidth={0}
              width={200}
              fill="#949db0"
              fontFamily="'Open Sans', sans-serif"
              fontWeight={600}
              fontSize="13px"
              id={`${testID}--intent-label`}
              dy={-barThickness}
              dx={-5}
              cursor="pointer"
            />
          )}
          {data.map((datum, index) => (
            <Cell key={datum.label} fill={barColors[index % barColors.length].primary} />
          ))}
        </Bar>
        <Bar
          dataKey="secondary"
          stackId={STACK_ID}
          radius={barRadius}
          style={{ transform: `translate(${barStackGap}px,0)` }}
        >
          {data.map((datum, index) => (
            <Cell key={datum.label} fill={`url(#${getGradientID(index % barColors.length)})`} />
          ))}
        </Bar>
        {withLabels && (
          <Bar dataKey="empty" stackId={STACK_ID}>
            <LabelList
              dataKey="total"
              position="right"
              formatter={abbreviateNumber}
              strokeWidth={0}
              fontFamily="'Open Sans', sans-serif"
              id={`${testID}--intent-total`}
              fontWeight={600}
              fontSize="13px"
              dx={barStackGap}
              width={200}
            />
            {data.map((datum, index) => (
              <Cell key={datum.label} fill={barColors[index % barColors.length].primary} />
            ))}
          </Bar>
        )}
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
