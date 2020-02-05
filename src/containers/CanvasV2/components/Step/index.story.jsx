import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '../Block/NewBlock';
import Step from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    label: 'Step',
    onClickPort,
  };
};

export const primary = () => (
  <NewBlock name="Block">
    <Step {...getProps()} label="Primary Step" />
  </NewBlock>
);

export const secondary = () => (
  <NewBlock name="Block">
    <Step labelVariant="secondary" {...getProps()} label="Secondary Step" />
  </NewBlock>
);

export const withPlaceholder = () => {
  const { label, ...props } = getProps();

  return (
    <NewBlock name="Block">
      <Step labelVariant="secondary" placeholder="This step has a placeholder" {...props} />
    </NewBlock>
  );
};

export const withIcon = () => (
  <NewBlock name="Block">
    <Step icon="code" iconColor="red" {...getProps()} label="Step With Icon" />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Block">
    <Step withPort={false} {...getProps()} label="Step Without Port  " />
  </NewBlock>
);

export const withLongLabel = () => (
  <NewBlock name="Block">
    <Step {...getProps()} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
  </NewBlock>
);

export const withLongLabelAndNoPort = () => (
  <NewBlock name="Block">
    <Step withPort={false} {...getProps()} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Block">
    <Step isActive {...getProps()} />
  </NewBlock>
);

export const withConnectedPort = () => (
  <NewBlock name="Block">
    <Step isConnected {...getProps()} />
  </NewBlock>
);
