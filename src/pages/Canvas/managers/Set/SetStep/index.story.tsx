import React from 'react';

import { withStepContext } from '@/../.storybook';
import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';
import { ExpressionPreviewContainer } from '@/pages/Canvas/managers/If/IfStep/components';

import { SetStep, SetStepProps } from '.';

const generateSetLabel = ({ expression, variable }: any) => {
  return <ExpressionPreview prefix={`{${variable}} = `} expression={expression} container={ExpressionPreviewContainer} />;
};

const SETS = [
  {
    id: 'eqgqeg',
    variable: 'var1',
    expression: {
      id: 'v61b3sqy',
      type: 'value',
      value: 'basic string',
      depth: 0,
    },
  },
  {
    id: 'eq4gqeg',
    variable: 'var2',
    expression: {
      id: 'v61d3sh7',
      type: 'or',
      depth: 0,
      value: [
        { type: 'value', value: 'value 1', depth: 1 },
        { type: 'value', value: 'value 2', depth: 1 },
      ],
    },
  },
  {
    id: 'eqg6qeg',
    variable: 'var1',
    expression: {
      id: 'v6v3sfm',
      type: 'plus',
      depth: 0,
      value: [
        {
          id: 'v6w3s65',
          type: 'plus',
          depth: 1,
          value: [
            {
              id: 'v6x3stk',
              type: 'minus',
              depth: 2,
              value: [
                {
                  id: 'v6y3sj9',
                  type: 'times',
                  depth: 3,
                  value: [
                    { id: 'v6153sfi', type: 'variable', value: 'user_id', depth: 4 },
                    { id: 'v6163skz', type: 'value', value: 'value 3', depth: 4 },
                  ],
                },
                { id: 'v6173st3', type: 'value', value: 'value 4', depth: 3 },
              ],
            },
            { id: 'v6183si5', type: 'variable', value: 'locale', depth: 2 },
          ],
        },
        { id: 'v6193sf9', type: 'advance', value: 'value 5', depth: 1 },
      ],
    },
  },
];

const multiExpressionsLabels = [generateSetLabel(SETS[0]), generateSetLabel(SETS[1])];

const getProps = () => ({
  expressions: multiExpressionsLabels,
  portID: 'qeg13',
});

export default {
  title: 'Creator/Steps/Set Step',
  component: SetStep,
};

const render = (props?: Partial<SetStepProps>) => () => (
  <NewBlock name="Set Block">
    <SetStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepContext()(render({ expressions: [null] }));

export const singleExpression = withStepContext()(render({ expressions: [generateSetLabel(SETS[0])] }));

export const multipleExpression = withStepContext()(render({ expressions: multiExpressionsLabels }));

export const withoutPort = withStepContext({ withPorts: false })(render({ expressions: multiExpressionsLabels }));

export const active = withStepContext({ isActive: true })(render({ expressions: multiExpressionsLabels }));

export const connected = withStepContext({ isConnected: true })(render({ expressions: multiExpressionsLabels }));
