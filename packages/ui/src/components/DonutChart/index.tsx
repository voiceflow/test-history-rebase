import React from 'react';
import * as Recharts from 'recharts';

import { DonutChartStatistics, DonutChartTooltip } from './components';
import { PIE_PROPS, RADIAL_TICKS } from './constants';
import { DonutChartDatum } from './types';

export * from './types';

const createUnits = (responsive: boolean) => (radius: number) => responsive ? `${radius}%` : radius;

export interface DonutChartProps extends React.PropsWithChildren {
  data: DonutChartDatum[];

  /* layout */
  /**
   * when `true` all scaling props will be treated as a percentage of the container size
   * when `false` they will be treated as absolute SVG units
   */
  responsive?: boolean;
  innerRadius?: number;
  outerRadius?: number;

  /* inner-shadow */
  shadowRadius?: number;
  shadowColor?: string;

  /* radial ticks */
  tickLength?: number;
  tickOffset?: number;
  withRadialTicks?: boolean;

  /* tooltip */
  withTooltip?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  responsive = true,
  innerRadius = 75,
  outerRadius = 100,

  shadowRadius = 5,
  shadowColor = 'rgba(0,0,0,0.1)',

  tickLength = 5,
  tickOffset = 5,
  withRadialTicks = false,

  withTooltip = false,
  children,
}) => {
  const sorted = React.useMemo(() => [...data].sort((lhs, rhs) => lhs.value - rhs.value), [data]);
  const units = createUnits(responsive);
  const tickOuterRadius = innerRadius - tickOffset;

  return (
    <Recharts.ResponsiveContainer width="100%" height="100%">
      <Recharts.PieChart innerRadius={units(tickOuterRadius - tickLength)} outerRadius={units(tickOuterRadius)}>
        {/* renders radial ticks inside the donut */}
        {withRadialTicks && <Recharts.PolarGrid gridType="circle" polarAngles={RADIAL_TICKS} polarRadius={[]} stroke="#dbe0e4" />}

        <Recharts.Pie {...PIE_PROPS} data={sorted} innerRadius={units(innerRadius)} outerRadius={units(outerRadius)}>
          {sorted.map((datum) => (
            <Recharts.Cell key={datum.label} fill={datum.color} stroke="transparent" />
          ))}
        </Recharts.Pie>

        {/* renders the inner-shadow effect on the donuts */}
        <Recharts.Pie {...PIE_PROPS} data={sorted} innerRadius={units(innerRadius)} outerRadius={units(innerRadius + shadowRadius)}>
          {sorted.map((datum) => (
            <Recharts.Cell key={datum.label} fill={shadowColor} stroke="transparent" />
          ))}
        </Recharts.Pie>

        {withTooltip && <Recharts.Tooltip content={<DonutChartTooltip />} />}

        {children}
      </Recharts.PieChart>
    </Recharts.ResponsiveContainer>
  );
};

export default Object.assign(DonutChart, {
  Tooltip: DonutChartTooltip,
  Statistics: DonutChartStatistics,
});
