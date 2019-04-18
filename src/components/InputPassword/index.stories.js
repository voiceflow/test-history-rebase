/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import storyRouter from 'storybook-react-router';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import withMinWidth from 'stories/decorators/withMinWidth';

import InputPassword from './index';

storiesOf('components/InputPassword', module)
  .addDecorator(withMinWidth(400))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .addDecorator(storyRouter())
  .add('default', () => <InputPassword value={text('value', '123')} />)
  .add('with error', () => (
    <InputPassword value={text('value', '123')} error={text('error', 'some error')} />
  ));
