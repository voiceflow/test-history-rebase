import { DonutChart, DonutChartDatum } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const data: DonutChartDatum[] = [
  { label: 'Recognized', value: 2132, percentage: 0.8367, color: '#5b9fd7' },
  { label: 'Not Understood', value: 416, percentage: 0.1633, color: '#cf4767' },
];

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <div style={{ width: 300, height: 300 }}>{children}</div>;
const LargeWrapper: React.FC<React.PropsWithChildren> = ({ children }) => <div style={{ width: '60vw', height: '60vw' }}>{children}</div>;

const defaultSize = createExample('default size', () => (
  <Wrapper>
    <DonutChart data={data} />
  </Wrapper>
));

const customRadius = createExample('custom radiuses', () => (
  <Wrapper>
    <DonutChart data={data} outerRadius={80} innerRadius={60} shadowRadius={10} />
  </Wrapper>
));

const withRadialTicks = createExample('radial ticks', () => (
  <Wrapper>
    <DonutChart data={data} withRadialTicks />
  </Wrapper>
));

const withTooltip = createExample('tooltip', () => (
  <Wrapper>
    <DonutChart data={data} withTooltip />
  </Wrapper>
));

const withStatistics = createExample('statistics', () => (
  <Wrapper>
    <DonutChart data={data}>
      <g>
        <DonutChart.Statistics percentage={data[0].value} delta={4.98} />
      </g>
    </DonutChart>
  </Wrapper>
));

const responsiveSize = createExample('responsive size', () => (
  <LargeWrapper>
    <DonutChart data={data} />
  </LargeWrapper>
));

const staticSize = createExample('static size', () => (
  <LargeWrapper>
    <DonutChart data={data} responsive={false} />
  </LargeWrapper>
));

export default createSection('DonutChart', 'src/components/DonutChart/index.tsx', [
  defaultSize,
  customRadius,
  withStatistics,
  withTooltip,
  withRadialTicks,

  responsiveSize,
  staticSize,
]);
