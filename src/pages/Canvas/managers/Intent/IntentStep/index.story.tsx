import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { IntentStep, IntentStepProps } from '.';

const getProps = () => {
  return {
    withPorts: true,
    label: 'Order Pizza',
    portID: 'intent',
  };
};

export default {
  title: 'Creator/Steps/Intent Step',
  component: IntentStep,
};

const render = (props?: Partial<IntentStepProps>) => () => (
  <NewBlock name="Intent Block">
    <IntentStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepDispatcher()(render({ label: undefined }));

export const withLabel = withStepDispatcher()(render());

export const withoutPort = withStepDispatcher()(render({ withPorts: false }));

export const active = withStepDispatcher()(render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
