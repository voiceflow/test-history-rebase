import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import { useToggle } from '@/hooks';

import RadioGroup from '.';

const OPTIONS = [
  {
    id: 1,
    label: 'Option 1',
  },
  {
    id: 2,
    label: 'Option 2',
  },
  {
    id: 3,
    label: 'Option 3',
  },
];

const getProps = () => {
  const [checked, toggleChecked] = useToggle();

  return {
    checked,
    onChange: toggleChecked,
    disabled: boolean('Disabled', false),
  };
};

export default {
  title: 'Radio Group',
  component: RadioGroup,
  includeStories: [],
};

export const normal = () => <RadioGroup name="yesNo" {...getProps()} />;

export const multiselect = () => <RadioGroup options={OPTIONS} name="multiple" {...getProps()} />;
