import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { PermissionStep, PermissionStepProps } from '.';

const getProps = () => ({
  portID: 'abc',
  withPorts: true,
  permissions: ['Email', 'Full Name', 'User Name'],
});

const render = (props?: Partial<PermissionStepProps>) => (
  <NewBlock name="Permission Block">
    <PermissionStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Permission Step',
  component: PermissionStep,
};

export const empty = withStepDispatcher()(() => render({ permissions: [] }));

export const withPermissions = withStepDispatcher()(render);

export const withoutPort = withStepDispatcher()(() => render({ withPorts: false }));

// eslint-disable-next-line sonarjs/no-identical-functions
export const connected = withStepDispatcher({ hasActiveLinks: true })(render);

export const active = withStepDispatcher()(() => render({ isActive: true }));
