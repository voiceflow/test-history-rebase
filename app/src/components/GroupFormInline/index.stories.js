/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, object, withKnobs } from '@storybook/addon-knobs';

import GroupFormInline from './index';

storiesOf('components/GroupFormInline', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <GroupFormInline
      size={text('size', 'sm')}
      cols={object('cols', [{ content: 'col 1' }, { content: 'col 2' }])}
      className={text('className', '')}
    />
  ));
