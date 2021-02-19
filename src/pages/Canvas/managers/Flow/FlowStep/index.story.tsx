import { withStepContext } from '_storybook';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';

import { FlowStep, FlowStepProps } from '.';

const getProps = () => ({
  label: 'New User Flow',
  portID: 'abc',
});

const render = (props?: Partial<FlowStepProps>) => () => (
  <Block name="Flow Block">
    <FlowStep {...getProps()} {...props} />
  </Block>
);

export default {
  title: 'Creator/Steps/Flow Step',
  component: FlowStep,
};

export const empty = withStepContext()(render({ label: undefined }));

export const withLabel = withStepContext()(render());

export const withLongLabel = withStepContext()(render({ label: 'Really long and elaborate flow name' }));

export const active = withStepContext({ isActive: true })(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const connected = withStepContext({ isConnected: true })(render());
