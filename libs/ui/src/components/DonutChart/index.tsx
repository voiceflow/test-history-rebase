import React from 'react';
import { Pie, PieChart, PolarGrid, ResponsiveContainer, Tooltip } from 'recharts';

import { DonutChartShape, DonutChartStatistics, DonutChartTooltip } from './components';
import { PIE_PROPS, RADIAL_TICKS } from './constants';
import type { DonutChartDatum } from './types';

export * from './types';

const createUnits = (responsive: boolean) => (radius: number) => (responsive ? `${radius}%` : radius);

export interface DonutChartProps extends React.PropsWithChildren {
  data: DonutChartDatum[];
  onClick?: (data: any, index: number) => void;

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
  innerRadius = 67,
  outerRadius = 92,

  shadowRadius = 5,
  shadowColor = 'rgba(0,0,0,0.1)',

  tickLength = 5,
  tickOffset = 5,
  withRadialTicks = false,

  withTooltip = false,
  onClick,
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const sorted = React.useMemo(() => [...data].sort((lhs, rhs) => lhs.value - rhs.value), [data]);
  const units = createUnits(responsive);
  const tickOuterRadius = innerRadius - tickOffset;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieExit = () => {
    setActiveIndex(-1);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart innerRadius={units(tickOuterRadius - tickLength)} outerRadius={units(tickOuterRadius)}>
        {/* renders radial ticks inside the donut */}
        {withRadialTicks && (
          <PolarGrid gridType="circle" polarAngles={RADIAL_TICKS} polarRadius={[]} stroke="#dbe0e4" />
        )}

        {/* render the actual values of the donuts */}
        <Pie
          {...PIE_PROPS}
          data={sorted}
          innerRadius={units(innerRadius)}
          outerRadius={units(outerRadius)}
          cursor="pointer"
          onClick={onClick}
          inactiveShape={<DonutChartShape shadowRadius={shadowRadius} shadowColor={shadowColor} />}
          activeShape={<DonutChartShape shadowRadius={shadowRadius} shadowColor={shadowColor} isActive />}
          activeIndex={activeIndex}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieExit}
        />

        {withTooltip && <Tooltip content={<DonutChartTooltip />} />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Object.assign(DonutChart, {
  Tooltip: DonutChartTooltip,
  Statistics: DonutChartStatistics,
});
