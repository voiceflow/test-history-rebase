import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import RandomStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    paths: [
      {
        isConnected: false,
        onClickPort,
      },
    ],
  };
};

export default {
  title: 'Creator/Steps/Random Step',
  component: RandomStep,
};

export const singlePath = () => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} />
  </NewBlock>
);

export const manyPaths = () => (
  <NewBlock name="Random Block">
    <RandomStep
      {...getProps()}
      paths={[
        {
          isConnected: false,
          onClickPort: action('click port 1'),
        },
        {
          isConnected: true,
          onClickPort: action('click port 2'),
        },
        {
          isConnected: true,
          onClickPort: action('click port 3'),
        },
      ]}
    />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} isActive />
  </NewBlock>
);
