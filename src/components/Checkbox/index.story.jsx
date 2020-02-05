import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import Checkbox from '.';

const getProps = () => {
  const [checked, setChecked] = React.useState(false);

  return {
    checked,
    onChange: setChecked,
    disabled: boolean('Disabled', false),
  };
};

export default {
  title: 'Checkbox',
  component: Checkbox,
  includeStories: [],
};

export const normal = () => (
  <Checkbox type="checkbox" {...getProps()}>
    <span>checkbox</span>
  </Checkbox>
);

export const withError = () => (
  <Checkbox type="checkbox" error {...getProps()}>
    <span>checkbox</span>
  </Checkbox>
);
