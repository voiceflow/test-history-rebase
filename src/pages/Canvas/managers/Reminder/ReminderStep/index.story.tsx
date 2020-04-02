import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { ReminderStep, ReminderStepProps } from '.';

const getProps = () => ({
  label: 'Bulk order reminder',
  successPortID: 'abc',
  failurePortID: 'def',
  withPorts: true,
});

const render = (props?: Partial<ReminderStepProps>) => () => (
  <NewBlock name="Reminder Block">
    <ReminderStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Reminder Step',
  component: ReminderStep,
};

export const empty = withStepContext()(render({ label: undefined }));

export const withLonglabel = withStepContext()(render({ label: 'This is your reminder to wash your car.' }));

export const withoutPorts = withStepContext()(render({ withPorts: false }));

export const connected = withStepContext({ isConnected: true })(render());

export const active = withStepContext({ isActive: true })(render());
