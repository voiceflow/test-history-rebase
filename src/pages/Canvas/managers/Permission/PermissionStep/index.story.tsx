import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { PermissionStep, PermissionStepProps } from '.';

const getProps = () => ({
  portID: 'abc',
  permissions: ['Email', 'Full Name', 'User Name'],
});

const render = (props?: Partial<PermissionStepProps>) => () => (
  <NewBlock name="Permission Block">
    <PermissionStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Permission Step',
  component: PermissionStep,
};

export const empty = withStepContext()(render({ permissions: [] }));

export const withPermissions = withStepContext()(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const connected = withStepContext({ isConnected: true })(render());

export const active = withStepContext({ isActive: true })(render());
