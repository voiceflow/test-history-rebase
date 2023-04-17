import { BarChart, BarChartDatum } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const data: BarChartDatum[] = [
  {
    label: 'Transfer Funds',
    primary: 1400,
    secondary: 1000,
  },
  {
    label: 'Lost Card',
    primary: 3100,
    secondary: 1000,
  },
  {
    label: 'Talk to Agent',
    primary: 4700,
    secondary: 1000,
  },
  {
    label: 'General Banking',
    primary: 5800,
    secondary: 1000,
  },
  {
    label: 'Book a Consultation',
    primary: 7900,
    secondary: 1000,
  },
];

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <div style={{ width: 500, height: 300 }}>{children}</div>;
const LargeWrapper: React.FC<React.PropsWithChildren> = ({ children }) => <div style={{ width: '60vw', height: '60vw' }}>{children}</div>;

const defaultSize = createExample('default size', () => (
  <Wrapper>
    <BarChart data={data} />
  </Wrapper>
));

const customBars = createExample('custom bars', () => (
  <Wrapper>
    <BarChart
      data={data}
      barThickness={20}
      barRadius={10}
      barStackGap={6}
      barColors={[
        { primary: '#142bc2', light: '#8695f3', lighter: '#c2caf9' },
        { primary: '#236d1c', light: '#88df81', lighter: '#beeeb9' },
        { primary: '#cb1a9c', light: '#f29cdb', lighter: '#f9d2ef' },
        { primary: '#b67911', light: '#f2c069', lighter: '#f7d69c' },
        { primary: '#d9321c', light: '#f4a99f', lighter: '#f9c9c3' },
      ]}
    />
  </Wrapper>
));

const repeatColors = createExample('repeat colors', () => (
  <Wrapper>
    <BarChart
      data={[
        ...data,
        {
          label: 'Open Account',
          primary: 1900,
          secondary: 300,
        },
        {
          label: 'Check Portfolio',
          primary: 1200,
          secondary: 800,
        },
      ]}
    />
  </Wrapper>
));

const withLabels = createExample('labels', () => (
  <Wrapper>
    <BarChart data={data} withLabels />
  </Wrapper>
));

const withTooltip = createExample('tooltip', () => (
  <Wrapper>
    <BarChart data={data} withTooltip />
  </Wrapper>
));

const responsiveSize = createExample('responsive size', () => (
  <LargeWrapper>
    <BarChart data={data} />
  </LargeWrapper>
));

export default createSection('BarChart', 'src/components/BarChart/index.tsx', [
  defaultSize,
  customBars,
  repeatColors,
  withLabels,
  withTooltip,
  responsiveSize,
]);
