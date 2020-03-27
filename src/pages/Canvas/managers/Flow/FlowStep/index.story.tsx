import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { FlowStep, FlowStepProps } from '.';

const getProps = () => ({
  label: 'New User Flow',
  portID: 'abc',
});

const render = (props?: Partial<FlowStepProps>) => () => (
  <NewBlock name="Flow Block">
    <FlowStep {...getProps()} {...props} />
  </NewBlock>
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
