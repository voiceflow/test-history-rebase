import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { ChoiceStep, ChoiceStepProps } from '.';

const CHOICES = [
  {
    label: 'Order Pizza',
    portID: 'ghi',
  },
  {
    label: 'Order my favourite',
    portID: 'jkl',
  },
  {
    label: 'Where is my order?',
    portID: 'mno',
  },
];

const getProps = () => ({
  choices: CHOICES,
  elsePortID: 'def',
});

const render = (props?: Partial<ChoiceStepProps>) => () => (
  <NewBlock name="Choice Block">
    <ChoiceStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Choice Step',
  component: ChoiceStep,
};

export const empty = withStepContext()(render({ choices: [] }));

export const multiple = withStepContext()(render());

export const single = withStepContext()(render({ choices: [CHOICES[0]] }));

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
