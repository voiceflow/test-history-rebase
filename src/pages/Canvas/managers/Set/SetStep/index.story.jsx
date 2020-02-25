import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import SetStep from '.';

const SETS = [
  {
    id: 'v61b3sqy',
    type: 'value',
    value: 'basic string',
    depth: 0,
  },
  {
    id: 'v61d3sh7',
    type: 'or',
    depth: 0,
    value: [
      { type: 'value', value: 'value 1', depth: 1 },
      { type: 'value', value: 'value 2', depth: 1 },
    ],
  },
  {
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
];

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    expressions: SETS,
  };
};

export default {
  title: 'Creator/Steps/Set Step',
  component: SetStep,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Set Block">
      <SetStep onClickPort={onClickPort} expressions={[]} />
    </NewBlock>
  );
};

export const singleExpression = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Set Block">
      <SetStep
        onClickPort={onClickPort}
        expressions={[
          {
            id: 'v61d3sh7',
            type: 'or',
            depth: 0,
            value: [
              { id: 'v6153sfi', type: 'variable', value: 'user_id', depth: 4 },
              { type: 'value', value: 'single set', depth: 1 },
            ],
          },
        ]}
      />
    </NewBlock>
  );
};

export const multipleExpression = () => (
  <NewBlock name="Set Block">
    <SetStep {...getProps()} />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Set Block">
    <SetStep {...getProps()} withPort={false} />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Set Block">
    <SetStep {...getProps()} isActive />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Set Block">
    <SetStep {...getProps()} isConnected />
  </NewBlock>
);
