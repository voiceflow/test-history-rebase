import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import PermissionStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    permissions: ['Email', 'Full Name', 'User Name'],
  };
};

export default {
  title: 'Creator/Steps/Permission Step',
  component: PermissionStep,
};

export const empty = () => (
  <NewBlock name="Permission Block">
    <PermissionStep permissions={[]} />
  </NewBlock>
);

export const withPermissions = () => (
  <NewBlock name="Permission Block">
    <PermissionStep {...getProps()} />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Permission Block">
    <PermissionStep {...getProps()} withPort={false} />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Permission Block">
    <PermissionStep {...getProps()} isConnected />
  </NewBlock>
);
export const active = () => (
  <NewBlock name="Permission Block">
    <PermissionStep {...getProps()} isActive />
  </NewBlock>
);
