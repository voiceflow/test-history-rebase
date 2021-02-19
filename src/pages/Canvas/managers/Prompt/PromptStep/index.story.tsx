import { withStepContext } from '_storybook';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';

import { PromptStep, PromptStepProps } from '.';

const render = (props?: Partial<PromptStepProps>) => () => (
  <Block name="Prompt Block">
    <PromptStep {...props} />
  </Block>
);

export default {
  title: 'Creator/Steps/Prompt Step',
  component: PromptStep,
};

export const empty = withStepContext()(render());
