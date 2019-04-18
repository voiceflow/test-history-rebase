/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, object, select, withKnobs } from '@storybook/addon-knobs';

import { convertArrayToSelect } from 'stories/lib/helpers';

import Select from './index';

const options = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
];

storiesOf('components/Select', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Select
      label={text('label', '')}
      value={select('value', convertArrayToSelect(options), '2')}
      options={object('options', options)}
      onSelect={action('onSelect')}
    />
  ));
