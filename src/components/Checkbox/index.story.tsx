import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import Checkbox from '.';

const getProps = () => {
  const [checked, setChecked] = React.useState(false);

  return {
    checked,
    onChange: () => setChecked(!checked),
    disabled: boolean('Disabled', false),
  };
};

export default {
  title: 'Checkbox',
  component: Checkbox,
  includeStories: [],
};

export const normal = () => (
  <Checkbox {...getProps()}>
    <span>checkbox</span>
  </Checkbox>
);

export const withError = () => (
  <Checkbox error {...getProps()}>
    <span>checkbox</span>
  </Checkbox>
);
