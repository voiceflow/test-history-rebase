import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import Reminder from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    label: 'Bulk order reminder',
  };
};

export default {
  title: 'Creator/Steps/Reminder Step',
  component: Reminder,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Reminder Block">
      <Reminder onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const withLonglabel = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Reminder Block">
      <Reminder onClickPort={onClickPort} label="This is your reminder to wash your car." />
    </NewBlock>
  );
};

export const withoutPorts = () => {
  return (
    <NewBlock name="Reminder Block">
      <Reminder withPorts={false} {...getProps()} />
    </NewBlock>
  );
};

export const connected = () => {
  return (
    <NewBlock name="Reminder Block">
      <Reminder {...getProps()} isConnectedFail isConnectedSuccess />
    </NewBlock>
  );
};

export const active = () => {
  return (
    <NewBlock name="Reminder Block">
      <Reminder {...getProps()} isActive />
    </NewBlock>
  );
};
