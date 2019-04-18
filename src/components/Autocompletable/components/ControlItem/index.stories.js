/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import ControlItem from './index';

storiesOf('components/Autocompletable/ControlItem', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => <ControlItem value={text('value', 'value')} />)
  .add('with label', () => (
    <ControlItem label={text('label', 'label')} value={text('value', 'value')} />
  ));
