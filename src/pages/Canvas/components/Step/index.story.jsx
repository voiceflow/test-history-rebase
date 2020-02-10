import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '../Block/NewBlock';
import Step, { Item, Section } from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    label: 'Step',
    onClickPort,
  };
};

export const primary = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item {...getProps()} label="Primary Step" />
      </Section>
    </Step>
  </NewBlock>
);

export const secondary = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item labelVariant="secondary" {...getProps()} label="Secondary Step" />
      </Section>
    </Step>
  </NewBlock>
);

export const withPlaceholder = () => {
  const { label, ...props } = getProps();

  return (
    <NewBlock name="Block">
      <Step>
        <Section>
          <Item labelVariant="secondary" placeholder="This step has a placeholder" {...props} />
        </Section>
      </Step>
    </NewBlock>
  );
};

export const withIcon = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item icon="code" iconColor="red" {...getProps()} label="Step With Icon" />
      </Section>
    </Step>
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item withPort={false} {...getProps()} label="Step Without Port  " />
      </Section>
    </Step>
  </NewBlock>
);

export const withLongLabel = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item {...getProps()} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
      </Section>
    </Step>
  </NewBlock>
);

export const withLongLabelAndNoPort = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item withPort={false} {...getProps()} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
      </Section>
    </Step>
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Block">
    <Step isActive>
      <Section>
        <Item {...getProps()} />
      </Section>
    </Step>
  </NewBlock>
);

export const withConnectedPort = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item isConnected {...getProps()} />
      </Section>
    </Step>
  </NewBlock>
);

export const withMultipleSections = () => (
  <NewBlock name="Block">
    <Step>
      <Section>
        <Item icon="code" iconColor="red" {...getProps()} />
      </Section>
      <Section>
        <Item isConnected {...getProps()} />
        <Item {...getProps()} label="Cupidatat dolor non est non esse. Consectetur veniam nisi exercitation." />
      </Section>
      <Section>
        <Item withPort={false} {...getProps()} />
      </Section>
    </Step>
  </NewBlock>
);
