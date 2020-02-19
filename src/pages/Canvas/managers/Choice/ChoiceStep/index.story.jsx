import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import ChoiceStep from '.';

const getProps = (isConnected = false) => {
  const onClickPort = action('click port');
  const onElseClickPort = action('click else port');

  return {
    choices: [
      {
        label: 'Order Pizza',
        onClickPort,
        isConnected,
      },
      {
        label: 'Order my favourite',
        onClickPort,
        isConnected,
      },
      {
        label: 'Where is my order?',
        onClickPort,
        isConnected,
      },
    ],
    onElseClickPort,
    isElseConnected: isConnected,
  };
};

export default {
  title: 'Creator/Steps/Choice Step',
  component: ChoiceStep,
};
export const empty = () => (
  <NewBlock name="Choice Block">
    <ChoiceStep choices={[]} />
  </NewBlock>
);

export const multiple = () => (
  <NewBlock name="Choice Block">
    <ChoiceStep {...getProps()} />
  </NewBlock>
);

export const single = () => (
  <NewBlock name="Choice Block">
    <ChoiceStep
      choices={[
        {
          label: 'Order Pizza',
        },
      ]}
      onClickPort={action('click port')}
      onElseClickPort={action('click else port')}
    />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Choice Block">
    <ChoiceStep {...getProps()} isActive />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Choice Block">
    <ChoiceStep {...getProps(true)} />
  </NewBlock>
);
