import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
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

export const empty = withStepDispatcher()(render({ label: undefined }));

export const withLonglabel = withStepDispatcher()(render({ label: 'This is your reminder to wash your car.' }));

export const withoutPorts = withStepDispatcher()(render({ withPorts: false }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());

export const active = withStepDispatcher()(render({ isActive: true }));
