import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';

import DropdownButton from '.';

const MENU_OPTIONS = Array(4)
  .fill(0)
  .map((_, index) => ({ value: { id: `opt${index + 1}` }, label: `Option ${index + 1}` }));

const getProps = () => ({
  disabled: boolean('Disabled', false),
  children: text('Label', 'Dropdown Button'),
  onSelect: action('select'),
});

export default {
  title: 'Dropdown Button',
  component: DropdownButton,
};

export const primary = () => <DropdownButton options={MENU_OPTIONS} {...getProps()} />;

export const secondary = () => <DropdownButton variant="secondary" options={MENU_OPTIONS} {...getProps()} />;
