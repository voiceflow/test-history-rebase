/* eslint-disable import/no-extraneous-dependencies */

import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { object, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { convertArrayToSelect } from 'stories/lib/helpers';

import Select from './index';

const options = [{ id: '1', label: 'Option 1' }, { id: '2', label: 'Option 2' }, { id: '3', label: 'Option 3' }];

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
