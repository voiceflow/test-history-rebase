/* eslint-disable import/no-extraneous-dependencies */

import centered from '@storybook/addon-centered';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import storyRouter from 'storybook-react-router';

import Link from './index';

storiesOf('components/Link', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .addDecorator(storyRouter())
  .add('default', () => (
    <Link to={text('to', '/')} component={text('component', 'div')}>
      {text('children', 'children')}
    </Link>
  ));
