import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import UserInfo from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    userPermissions: ['Email', 'User Name', 'Credit Card'],
  };
};

export default {
  title: 'Creator/Steps/User Info Step',
  component: UserInfo,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="User Info Block">
      <UserInfo onClickPort={onClickPort} userPermissions={[]} />
    </NewBlock>
  );
};

export const withoutPorts = () => {
  return (
    <NewBlock name="User Info Block">
      <UserInfo withPorts={false} {...getProps()} />
    </NewBlock>
  );
};

export const withPermissions = () => {
  return (
    <NewBlock name="User Info Block">
      <UserInfo {...getProps()} />
    </NewBlock>
  );
};

export const connected = () => {
  return (
    <NewBlock name="User Info Block">
      <UserInfo {...getProps()} isConnectedFail isConnectedSuccess />
    </NewBlock>
  );
};

export const active = () => {
  return (
    <NewBlock name="User Info Block">
      <UserInfo {...getProps()} isActive />
    </NewBlock>
  );
};
