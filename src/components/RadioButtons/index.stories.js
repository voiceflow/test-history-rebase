/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, boolean, object, select, withKnobs } from '@storybook/addon-knobs';

import { convertArrayToSelect } from 'stories/lib/helpers';

import RadioButtons from './index';

const buttons = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
];

storiesOf('components/RadioButtons', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <RadioButtons
      label={text('label', 'Label')}
      checked={select('checked', convertArrayToSelect(buttons), '1')}
      buttons={object('buttons', buttons)}
      onChange={action('onChange')}
      className={text('className', '__size-md')}
      disabledAll={boolean('disabledAll', false)}
    />
  ));
