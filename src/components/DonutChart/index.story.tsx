import { number, object } from '@storybook/addon-knobs';
import React from 'react';

import DonutChart, { DonutDataItem } from '.';

export default {
  title: 'DonutChart',
  component: DonutChart,
};

const DEFAULT_DATA = [
  { key: 'blue', color: '#5d9df5', value: 90 },
  { key: 'red', color: '#f1467b', value: 10 },
];

const getProps = ({ data = DEFAULT_DATA }: { data?: DonutDataItem[] } = {}) => ({
  size: number('size', 150),
  data: object('data', data),
});

export const normal = () => <DonutChart {...getProps()} />;

export const tooltip = () => (
  <DonutChart
    {...getProps()}
    renderTooltip={(data) => (
      <dl>
        <dt>{data.key}</dt>
        <dd>{data.value}</dd>
      </dl>
    )}
  />
);

export const multiplePieces = () => (
  <DonutChart
    {...getProps({
      data: [
        { key: 'blue', color: '#5d9df5', value: 10 },
        { key: 'red', color: '#f1467b', value: 20 },
        { key: 'purple', color: '#4d5cad', value: 30 },
        { key: 'green', color: '#6b7a6b', value: 40 },
      ],
    })}
  />
);
