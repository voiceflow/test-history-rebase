import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { RandomStep, RandomStepProps } from '.';

const getProps = () => ({
  ports: ['abc'],
  withPorts: true,
});

const render = (props?: Partial<RandomStepProps>) => () => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Random Step',
  component: RandomStep,
};

export const singlePath = withStepContext()(render());

export const manyPaths = withStepContext()(render({ ports: ['abc', 'def', 'ghi'] }));

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
