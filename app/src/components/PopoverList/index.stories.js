/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { object, boolean, select, withKnobs } from '@storybook/addon-knobs';

import { convertArrayToSelect } from 'stories/lib/helpers';

import PopoverList from './index';

const options = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
];

storiesOf('components/PopoverList', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <PopoverList
      items={object('options', options)}
      onClick={action('onClick')}
      selectedId={select('selectedId', convertArrayToSelect(options), '1')}
      textTruncate={boolean('textTruncate')}
    />
  ));
