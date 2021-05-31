import { withStepContext } from '_storybook';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';

import { SetStep, SetStepProps } from '.';

const getProps = () => ({
  portID: 'qeg13',
});

export default {
  title: 'Creator/Steps/Set Step',
  component: SetStep,
};

const render = (props?: Partial<SetStepProps>) => () => (
  <Block name="Set Block" nodeID="1234">
    <SetStep {...getProps()} {...props} nodeID="1234" />
  </Block>
);

export const empty = withStepContext()(render());

export const withTitle = withStepContext()(render({ title: 'Boom ' }));
