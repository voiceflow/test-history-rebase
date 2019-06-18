/* eslint-disable import/no-extraneous-dependencies */

import centered from '@storybook/addon-centered';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

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
