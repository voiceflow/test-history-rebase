/* eslint-disable import/no-extraneous-dependencies */

import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Selectable from './index';

storiesOf('components/Selectable', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Selectable
      value={text('value')}
      opened={boolean('opened', true)}
      onShow={action('onShow')}
      onHide={action('onHide')}
      onSelect={action('onSelect')}
      popoverRenderer={(props) => JSON.stringify(props)}
    >
      {(props) => JSON.stringify(props)}
    </Selectable>
  ));
