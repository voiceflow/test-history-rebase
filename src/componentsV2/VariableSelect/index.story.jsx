import { storiesOf } from '@storybook/react';
import cn from 'classnames';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import VariableSelectControl from './components/VariableSelectControl';

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

storiesOf('Variable Select', module).add(
  'variant',
  createTestableStory(() => (
    <>
      <Variant label="Variable Select">
        <VariableSelectControl placeholder="Variables" options={VARIABLE_OPTIONS} />
      </Variant>

      <Variant label="Variable Select Box">
        <VariableSelectControl classNamePrefix="variable-box" className={cn('variable-box')} placeholder="Variables" options={VARIABLE_OPTIONS} />
      </Variant>
    </>
  ))
);
