import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { UserInfoStep, UserInfoStepProps } from '.';

const getProps = () => ({
  withPorts: true,
  successPortID: 'abc',
  failurePortID: 'def',
  userPermissions: ['Email', 'User Name', 'Credit Card'],
});

const render = (props?: Partial<UserInfoStepProps>) => () => (
  <NewBlock name="User Info Block">
    <UserInfoStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/User Info Step',
  component: UserInfoStep,
};

export const empty = withStepDispatcher()(render({ userPermissions: [] }));

export const withoutPorts = withStepDispatcher()(render({ withPorts: false }));

export const withPermissions = withStepDispatcher()(render());

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());

export const active = withStepDispatcher({})(render({ isActive: true }));
