import { action } from '@storybook/addon-actions';
import React from 'react';

import Menu, { MenuItem } from '.';

const getProps = () => ({
  onSelect: action('select'),
});

export default {
  title: 'Menu',
  component: Menu,
  includeStories: [],
};

export const basic = () => (
  <Menu
    options={[
      {
        value: { id: 'opt1' },
        label: 'Grape Jelly',
      },
      {
        value: { id: 'opt2' },
        label: 'Mild Salsa',
      },
      {
        value: { id: 'opt3' },
        label: 'Hummus',
      },
      {
        value: { id: 'opt4' },
        label: 'Ranch Dressing',
      },
    ]}
    {...getProps()}
  />
);

export const scrolling = () => (
  <Menu
    options={Array(20)
      .fill(0)
      .map((_, index) => ({
        value: { id: `opt${index + 1}` },
        label: `Option ${index + 1}`,
      }))}
    {...getProps()}
  />
);

export const thin = () => (
  <Menu
    options={[
      {
        value: { id: 'opt1' },
        label: 'A',
      },
      {
        value: { id: 'opt2' },
        label: 'B',
      },
      {
        value: { id: 'opt3' },
        label: 'C',
      },
      {
        value: { id: 'opt4' },
        label: 'D',
      },
    ]}
    {...getProps()}
  />
);

export const divider = () => (
  <Menu>
    <MenuItem>Collaborators</MenuItem>
    <MenuItem>Workspace Settings</MenuItem>
    <MenuItem divider />
    <MenuItem>Payment</MenuItem>
  </Menu>
);

export const wide = () => (
  <Menu
    options={[
      {
        value: { id: 'opt1' },
        label: 'Antidisestablishmentarianism',
      },
      {
        value: { id: 'opt2' },
        label: 'A Man, A Plan, A Canal: Panama',
      },
      {
        value: { id: 'opt3' },
        label: 'An option with a very very verrrrrrrrrrrrrrrrrrrrrrrrrry long label',
      },
      {
        value: { id: 'opt4' },
        label: 'this one is short',
      },
    ]}
    {...getProps()}
  />
);

export const multiselect = () => {
  const selectAll = action('select all');

  return (
    <Menu
      options={[
        {
          value: { id: 'opt1' },
          label: 'Antidisestablishmentarianism',
        },
        {
          value: { id: 'opt2' },
          label: 'A Man, A Plan, A Canal: Panama',
        },
        {
          value: { id: 'opt3' },
          label: 'An option with a very very verrrrrrrrrrrrrrrrrrrrrrrrrry long label',
        },
        {
          value: { id: 'opt4' },
          label: 'this one is short',
        },
      ]}
      {...getProps()}
      multiSelectProps={{ multiselect: true, buttonClick: selectAll, buttonLabel: 'Select All' }}
    />
  );
};
