import React from 'react';

import { withStepContext } from '@/../.storybook';
import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { ExpressionPreviewContainer } from './components';
import { IfStep, IfStepProps } from '.';

const generateExpressionLabel = (expression: any) => {
  return <ExpressionPreview expression={expression} container={ExpressionPreviewContainer} />;
};

const value = {
  type: 'less',
  depth: 0,
  value: [
    { type: 'variable', value: 'timestamp', depth: 1 },
    { type: 'value', value: '212', depth: 1 },
  ],
};

const value2 = {
  id: '6k63u88',
  type: 'divide',
  depth: 0,
  value: [
    { type: 'value', value: '4', depth: 1 },
    {
      type: 'or',
      depth: 1,
      value: [
        { type: 'value', value: '5', depth: 2 },
        { type: 'advance', value: "{{[sessions].sessions}}.includes('en')", depth: 2 },
      ],
    },
  ],
};

const getProps = () => {
  return {
    expressions: [
      {
        label: generateExpressionLabel(value),
        portID: '123',
      },
      {
        label: generateExpressionLabel(value2),
        portID: 'w24',
      },
      {
        label: generateExpressionLabel(value),
        portID: 'w243g',
      },
    ],
    isActive: false,
    elsePortID: 'srh123',
    withPorts: true,
  };
};

const render = (props?: Partial<IfStepProps>) => () => (
  <NewBlock name="If Block">
    <IfStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/If Step',
  component: IfStep,
};

export const empty = withStepContext()(render({ expressions: [] }));

export const single = withStepContext()(
  render({
    expressions: [
      {
        label: generateExpressionLabel(value2),
        portID: 'w24',
      },
    ],
  })
);

export const multiple = withStepContext()(render());

export const active = withStepContext({ isActive: true })(render());
