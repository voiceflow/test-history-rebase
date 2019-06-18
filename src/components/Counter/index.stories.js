/* eslint-disable import/no-extraneous-dependencies */

import centered from '@storybook/addon-centered';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

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
