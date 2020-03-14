import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { RandomStep, RandomStepProps } from '.';

const getProps = () => ({
  ports: ['abc'],
  withPorts: true,
});

const render = (props?: Partial<RandomStepProps>) => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Random Step',
  component: RandomStep,
};

export const singlePath = withStepDispatcher()(render);

export const manyPaths = withStepDispatcher()(() => render({ ports: ['abc', 'def', 'ghi'] }));

export const active = withStepDispatcher()(() => render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render);
