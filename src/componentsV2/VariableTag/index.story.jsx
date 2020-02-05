import { text } from '@storybook/addon-knobs';
import React from 'react';

import { SlotTag, VariableTag } from '.';

const getProps = () => ({
  children: text('content', 'content'),
});

export default {
  title: 'Variable Tag',
  component: VariableTag,
};

export const variable = () => <VariableTag {...getProps()} />;

export const slot = () => {
  const color = text('color');

  return <SlotTag color={color} {...getProps()} />;
};
