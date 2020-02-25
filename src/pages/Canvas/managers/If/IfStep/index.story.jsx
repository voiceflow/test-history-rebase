import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import IfStep from '.';

const getProps = () => {
  const onClickPort = action('click port');
  const onElseClickPort = action('click else port');
  const value = {
    type: 'less',
    depth: 0,
    value: [
      { type: 'variable', value: 'timestamp', depth: 1 },
      { type: 'value', value: '212', depth: 1 },
    ],
  };

  return {
    expressions: [
      {
        value,
        onClickPort,
        isConnected: false,
      },
      {
        value: {
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
        },
        onClickPort,
        isConnected: true,
      },
      {
        value,
        onClickPort,
        isConnected: false,
      },
    ],
    onElseClickPort,
    isElseConnected: true,
  };
};

export default {
  title: 'Creator/Steps/If Step',
  component: IfStep,
};

export const empty = () => (
  <NewBlock name="If Block">
    <IfStep expressions={[]} />
  </NewBlock>
);

export const single = () => (
  <NewBlock name="If Block">
    <IfStep {...getProps()} expressions={[getProps().expressions[0]]} />
  </NewBlock>
);

export const multiple = () => (
  <NewBlock name="If Block">
    <IfStep {...getProps()} />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="If Block">
    <IfStep {...getProps()} isActive />
  </NewBlock>
);
