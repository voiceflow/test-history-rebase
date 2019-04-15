/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, number, boolean, withKnobs } from '@storybook/addon-knobs';

import Counter from './index';

storiesOf('components/Counter', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Counter
      limit={number('limit', 20)}
      length={number('length', 10)}
      absolute={boolean('absolute', false)}
      countWord={text('countWord')}
      withLabel={boolean('withLabel', false)}
      withDangerLabel={boolean('withDangerLabel', true)}
    />
  ));
