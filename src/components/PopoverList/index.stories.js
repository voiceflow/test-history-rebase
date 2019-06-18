/* eslint-disable import/no-extraneous-dependencies */

import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { boolean, object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { convertArrayToSelect } from 'stories/lib/helpers';

import PopoverList from './index';

const options = [{ id: '1', label: 'Option 1' }, { id: '2', label: 'Option 2' }, { id: '3', label: 'Option 3' }];

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
