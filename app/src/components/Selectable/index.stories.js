/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';

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
      popoverRenderer={props => JSON.stringify(props)}
    >
      {props => JSON.stringify(props)}
    </Selectable>
  ));
