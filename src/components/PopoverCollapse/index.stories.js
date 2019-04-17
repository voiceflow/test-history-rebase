/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import PopoverCollapse from './index';

storiesOf('components/PopoverCollapse', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <PopoverCollapse label={text('label', 'Label')}>
      <p>
        {text(
          'content',
          'Example phrases guide customers on how to interact with your skill, depending on whether it is a single interaction or a conversation.'
        )}
      </p>
    </PopoverCollapse>
  ));
