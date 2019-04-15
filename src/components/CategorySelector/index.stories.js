/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import withRootContainerClass from 'stories/decorators/withRootContainerClass';

import CategorySelector from './index';

storiesOf('components/CategorySelector', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .addDecorator(withRootContainerClass())
  .add('default', () => (
    <CategorySelector
      value={text('value', '')}
      error={text('error', '')}
      onSelect={action('onSelect')}
    />
  ))
  .add('with selected value', () => (
    <CategorySelector
      value={text('value', 'EVENT_FINDERS')}
      error={text('error', '')}
      onSelect={action('onSelect')}
    />
  ))
  .add('with error', () => (
    <CategorySelector
      value={text('value', 'EVENT_FINDERS')}
      error={text('error', 'some error')}
      onSelect={action('onSelect')}
    />
  ));
