import { withStepContext } from '_storybook';
import { ConditionsLogicInterface, ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import Text from '@/components/Text';
import Block from '@/pages/Canvas/components/Block';
import { expressionPreview } from '@/utils/expression';

import { IfStep, IfStepProps } from '.';

const generateExpressionLabel = (expression: any) => (expression.value.length > 0 ? <Text>{expressionPreview(expression)}</Text> : null);

const value = {
  type: null,
  name: 'is valid avengers',
  value: [
    {
      type: ExpressionTypeV2.EQUALS,
      logicInterface: ConditionsLogicInterface.VARIABLE,
      value: [
        {
          type: ExpressionTypeV2.VARIABLE,
          value: 'avenger',
        },
        {
          type: ExpressionTypeV2.VALUE,
          value: 'hulk',
        },
      ],
    },
  ],
};

const value2 = {
  type: null,
  name: 'valid credit card',
  value: [
    {
      type: ExpressionTypeV2.CONTAINS,
      logicInterface: ConditionsLogicInterface.VARIABLE,
      value: [
        {
          type: ExpressionTypeV2.VARIABLE,
          value: 'card',
        },
        {
          type: ExpressionTypeV2.VALUE,
          value: '4242',
        },
      ],
    },
  ],
};

const getProps = () => ({
  expressions: [
    {
      name: value.name,
      label: generateExpressionLabel(value),
      portID: '123',
    },
    {
      name: value2.name,
      label: generateExpressionLabel(value2),
      portID: 'w24',
    },
  ],
  isActive: false,
  elsePortID: 'srh123',
  withPorts: true,
});

const render = (props?: Partial<IfStepProps>) => () => (
  <Block name="If Block" nodeID="1232">
    <IfStep {...getProps()} {...props} nodeID="1232" />
  </Block>
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
