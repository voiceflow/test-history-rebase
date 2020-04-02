import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { IntentStep, IntentStepProps } from '.';

const getProps = () => ({
  label: 'Order Pizza',
  portID: 'intent',
});

export default {
  title: 'Creator/Steps/Intent Step',
  component: IntentStep,
};

const render = (props?: Partial<IntentStepProps>) => () => (
  <NewBlock name="Intent Block">
    <IntentStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepContext()(render({ label: undefined }));

export const withLabel = withStepContext()(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
