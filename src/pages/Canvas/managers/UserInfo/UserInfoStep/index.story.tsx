import React from 'react';

import { withStepContext } from '@/../.storybook';
import Block from '@/pages/Canvas/components/Block';

import { UserInfoStep, UserInfoStepProps } from '.';

const getProps = () => ({
  withPorts: true,
  successPortID: 'abc',
  failurePortID: 'def',
  userPermissions: ['Email', 'User Name', 'Credit Card'],
});

const render = (props?: Partial<UserInfoStepProps>) => () => (
  <Block name="User Info Block">
    <UserInfoStep {...getProps()} {...props} />
  </Block>
);

export default {
  title: 'Creator/Steps/User Info Step',
  component: UserInfoStep,
};

export const empty = withStepContext()(render({ userPermissions: [] }));

export const withoutPorts = withStepContext()(render({ withPorts: false }));

export const withPermissions = withStepContext()(render());

export const connected = withStepContext({ isConnected: true })(render());

export const active = withStepContext({ isActive: true })(render());
