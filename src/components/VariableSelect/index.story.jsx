import React from 'react';

import { VariableSelect } from '.';

const VARIABLE_OPTIONS = [
  {
    label: 'variable 1',
    value: 'variable 1',
  },
  {
    label: 'variable 2',
    value: 'variable 2',
  },
  {
    label: 'variable 3',
    value: 'variable 3',
  },
];

export default {
  title: 'Variable Select',
  component: VariableSelect,
};

export const normal = () => <VariableSelect placeholder="Variables" variables={VARIABLE_OPTIONS} />;
