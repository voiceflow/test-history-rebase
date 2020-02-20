import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import IntentStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    label: 'Order Pizza',
  };
};

export default {
  title: 'Creator/Steps/Intent Step',
  component: IntentStep,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Intent Block">
      <IntentStep onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const withLabel = () => (
  <NewBlock name="Intent Block">
    <IntentStep {...getProps()} />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Intent Block">
    <IntentStep {...getProps()} withPort={false} />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Intent Block">
    <IntentStep {...getProps()} isActive />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Intent Block">
    <IntentStep {...getProps()} isConnected />
  </NewBlock>
);
