/* eslint-disable import/no-extraneous-dependencies */

import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Dropdown from './index';

const options = [{ id: 'action1', label: 'Option 1' }, { id: 'action2', label: 'Option 2' }, { id: 'action3', label: 'Option 3' }];

storiesOf('components/Dropdown', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Dropdown
      label={text('label', 'Label')}
      options={object('options', options)}
      onAction1={action('onAction1')}
      onAction2={action('onAction2')}
      onAction3={action('onAction3')}
    />
  ))
  .add('with button props', () => (
    <Dropdown
      label={text('label', 'Label')}
      options={object('options', options)}
      onAction1={action('onAction1')}
      onAction2={action('onAction2')}
      onAction3={action('onAction3')}
      buttonProps={object('buttonProps', {
        isSecondary: true,
      })}
    />
  ));
