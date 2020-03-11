import { action } from '@storybook/addon-actions';
import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { FlowStep, FlowStepProps } from '.';

const getProps = () => {
  const onClick = action('click');

  return {
    label: 'New User Flow',
    portID: 'abc',
    onClick,
    withPorts: true,
  };
};

const render = (props?: Partial<FlowStepProps>) => () => (
  <NewBlock name="Flow Block">
    <FlowStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Flow Step',
  component: FlowStep,
};

export const empty = withStepDispatcher()(render({ label: undefined }));

export const withLabel = withStepDispatcher()(render());

export const withLongLabel = withStepDispatcher()(render({ label: 'Really long and elaborate flow name' }));

export const active = withStepDispatcher()(render({ isActive: true }));

export const withoutPort = withStepDispatcher()(render({ withPorts: false }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
