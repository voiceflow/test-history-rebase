/* eslint-disable import/no-extraneous-dependencies */

import centered from '@storybook/addon-centered';
import { boolean, object, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import withMinWidth from 'stories/decorators/withMinWidth';

import Loader from './index';

const sizes = {
  sm: 'sm',
  md: 'md',
  lg: '',
};

storiesOf('components/Loader', module)
  .addDecorator(withMinWidth(400))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Loader
      size={select('size', sizes, 'sm')}
      inner={boolean('inner', false)}
      inline={boolean('inline', false)}
      pending={boolean('pending', true)}
      transparent={boolean('transparent', false)}
      withoutIcon={boolean('withoutIcon', false)}
      isFullscreen={boolean('isFullscreen', false)}
    />
  ))
  .add('with children', () => (
    <Loader
      size={select('size', sizes, 'md')}
      inner={boolean('inner', false)}
      inline={boolean('inline', false)}
      pending={boolean('pending', true)}
      transparent={boolean('transparent', false)}
      withoutIcon={boolean('withoutIcon', false)}
      isFullscreen={boolean('isFullscreen', false)}
    >
      <h1>Loaded!</h1>
    </Loader>
  ))
  .add('with text', () => (
    <Loader
      size={select('size', sizes, '')}
      text={text('text', 'Loading...')}
      inner={boolean('inner', false)}
      inline={boolean('inline', false)}
      pending={boolean('pending', true)}
      transparent={boolean('transparent', false)}
      withoutIcon={boolean('withoutIcon', false)}
      isFullscreen={boolean('isFullscreen', false)}
    >
      <h1>Loaded!</h1>
    </Loader>
  ))
  .add('with multi text', () => (
    <Loader
      size={select('size', sizes, '')}
      text={object('text', ['Loading step 1...', 'Loading step 2...', 'Loading steep 3...'])}
      inner={boolean('inner', false)}
      timers={object('timers', [1000, 2000])}
      inline={boolean('inline', false)}
      pending={boolean('pending', true)}
      transparent={boolean('transparent', false)}
      withoutIcon={boolean('withoutIcon', false)}
      isFullscreen={boolean('isFullscreen', false)}
    >
      <h1>Loaded!</h1>
    </Loader>
  ));
