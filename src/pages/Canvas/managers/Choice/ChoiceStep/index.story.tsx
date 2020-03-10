import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { ChoiceStep, ChoiceStepProps } from '.';

const getProps = () => {
  return {
    choices: [
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
    ],
    elsePortID: 'def',
    withPorts: true,
    isActive: false,
  };
};

const render = (props?: Partial<ChoiceStepProps>) => () => (
  <NewBlock name="Choice Block">
    <ChoiceStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Choice Step',
  component: ChoiceStep,
};

export const empty = withStepDispatcher()(render({ choices: [] }));

export const multiple = withStepDispatcher()(render());

export const single = withStepDispatcher()(
  render({
    choices: [{ label: 'Order Pizza', portID: 'abc' }],
  })
);

export const active = withStepDispatcher()(render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
