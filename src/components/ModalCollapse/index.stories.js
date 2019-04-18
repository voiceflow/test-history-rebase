/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import ModalCollapse from './index';

storiesOf('components/ModalCollapse', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <ModalCollapse label={text('label', 'Label')}>
      <p>
        {text(
          'content',
          'Example phrases guide customers on how to interact with your skill, depending on whether it is a single interaction or a conversation.'
        )}
      </p>
    </ModalCollapse>
  ));
