import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import FlowStep from '.';

const getProps = () => {
  const onClickPort = action('click port');
  const onClick = action('click');

  return {
    label: 'New User Flow',
    onClickPort,
    onClick,
  };
};

export default {
  title: 'Creator/Steps/Flow Step',
  component: FlowStep,
};

export const empty = () => {
  const { label, ...props } = getProps();

  return (
    <NewBlock name="Flow Block">
      <FlowStep {...props} />
    </NewBlock>
  );
};

export const withLabel = () => (
  <NewBlock name="Flow Block">
    <FlowStep {...getProps()} />
  </NewBlock>
);

export const withLongLabel = () => (
  <NewBlock name="Flow Block">
    <FlowStep {...getProps()} label="Really long and elaborate flow name" />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Flow Block">
    <FlowStep {...getProps()} isActive />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Flow Block">
    <FlowStep {...getProps()} withPort={false} />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Flow Block">
    <FlowStep {...getProps()} isConnected />
  </NewBlock>
);
