import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import AddMinusButton from '.';

const getProps = () => ({
  disabled: boolean('Disabled'),
});

export default {
  title: 'Add-Minus Button',
  component: AddMinusButton,
};

export const plus = () => <AddMinusButton type="add" {...getProps()} />;

export const minus = () => <AddMinusButton type="minus" {...getProps()} />;
