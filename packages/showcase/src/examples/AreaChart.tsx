import { AreaChart, AreaChartDatum } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const firstDay = 1677375575946;
const oneDay = 1000 * 60 * 60 * 24;
const mapToDay =
  (data: number[]) =>
  (_: any, index: number): AreaChartDatum => ({ x: firstDay + index * oneDay, y: data[(index + 1) % data.length] });
const weeklyData = Array.from({ length: 7 }).map(mapToDay([201, 1000, 403, 382, 806, 755, 944]));
const monthlyData = Array.from({ length: 29 }).map(mapToDay([953_312, 876_235, 882_453, 972_687, 766_041, 877_106, 903_738]));
const yearlyBaseData = [923_412_532, 875_153_467, 989_108_908, 1_242_690_811, 1_239_084_203, 1_352_339_043, 1_132_352_104];
const yearlyData = Array.from({ length: 365 })
  .map(mapToDay([0]))
  .flatMap((datum, index) => {
    if (index % 7 === 0) return [{ ...datum, y: yearlyBaseData[(Math.floor(index / 7) + 1) % 7] }];

    return [];
  });

const Wrapper: React.FC<React.PropsWithChildren<{ width?: number }>> = ({ width = 500, children }) => (
  <div style={{ width, height: 250 }}>{children}</div>
);
const LargeWrapper: React.FC<React.PropsWithChildren> = ({ children }) => <div style={{ width: '60vw', height: 500 }}>{children}</div>;

const defaultSize = createExample('default size', () => (
  <Wrapper>
    <AreaChart data={weeklyData} />
  </Wrapper>
));

const customColor = createExample('custom color', () => (
  <Wrapper>
    <AreaChart data={weeklyData} color="#863ce2" />
  </Wrapper>
));

const withGrid = createExample('grid', () => (
  <Wrapper>
    <AreaChart data={weeklyData} withGrid />
  </Wrapper>
));

const withWeeklyAxis = createExample('weekly axis', () => (
  <Wrapper>
    <AreaChart data={weeklyData} withAxes formatter={AreaChart.WeeklyDateFormatter} />
  </Wrapper>
));

const withMonthlyAxis = createExample('monthly axis', () => (
  <Wrapper>
    <AreaChart data={monthlyData} withAxes formatter={AreaChart.MonthlyDateFormatter} />
  </Wrapper>
));

const withYearlyAxis = createExample('yearly axis', () => (
  <Wrapper width={800}>
    <AreaChart data={yearlyData} withAxes formatter={AreaChart.YearlyDateFormatter} />
  </Wrapper>
));

const withTooltip = createExample('tooltip', () => (
  <Wrapper>
    <AreaChart data={weeklyData} withTooltip formatter={AreaChart.WeeklyDateFormatter} />
  </Wrapper>
));

const responsiveSize = createExample('responsive size', () => (
  <LargeWrapper>
    <AreaChart data={weeklyData} />
  </LargeWrapper>
));

export default createSection('AreaChart', 'src/components/AreaChart/index.tsx', [
  defaultSize,
  customColor,
  withGrid,
  withWeeklyAxis,
  withMonthlyAxis,
  withYearlyAxis,
  withTooltip,
  responsiveSize,
]);
