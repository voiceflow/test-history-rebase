import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import CodeStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    codeAdded: true,
  };
};

export default {
  title: 'Creator/Steps/User Info Step',
  component: CodeStep,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Code Block">
      <CodeStep onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const emptyWithoutPorts = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Code Block">
      <CodeStep withPorts={false} onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const codeAdded = () => {
  return (
    <NewBlock name="Code Block">
      <CodeStep {...getProps()} />
    </NewBlock>
  );
};

export const withoutPorts = () => {
  return (
    <NewBlock name="Code Block">
      <CodeStep withPorts={false} {...getProps()} />
    </NewBlock>
  );
};

export const connected = () => {
  return (
    <NewBlock name="Code Block">
      <CodeStep {...getProps()} isConnectedFail isConnectedSuccess />
    </NewBlock>
  );
};

export const active = () => {
  return (
    <NewBlock name="Code Block">
      <CodeStep {...getProps()} isActive />
    </NewBlock>
  );
};
