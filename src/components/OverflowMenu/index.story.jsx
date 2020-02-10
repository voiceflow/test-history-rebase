import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import OverflowMenu from '.';

const MENU_OPTIONS = Array(4)
  .fill(0)
  .map((_, index) => ({ value: { id: `opt${index + 1}` }, label: `Option ${index + 1}` }));

const getProps = () => ({
  disabled: boolean('Disabled', false),
  onSelect: action('select'),
});

export default {
  title: 'Overflow Menu',
  component: OverflowMenu,
};

export const sameActionsForMenuItem = () => <OverflowMenu options={MENU_OPTIONS} {...getProps()} />;

export const differentActionsForMenuItem = () => (
  <OverflowMenu
    options={[
      { label: 'Label 1', onClick: () => alert('clicked Label 1') },
      { label: 'Label 2', onClick: () => alert('clicked Label 2') },
    ]}
  />
);
