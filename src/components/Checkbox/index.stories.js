/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';

import Checkbox from './index';

storiesOf('components/Checkbox', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add(
    'default',
    <div>
      <Checkbox
        name={text('name', 'name')}
        label={text('label', 'label')}
        isRadio={boolean('isRadio', false)}
        disabled={boolean('disabled', false)}
        className={text('className', '')}
        wrapValue={boolean('wrapValue', false)}
        noWrapValue={boolean('noWrapValue', false)}
      />
    </div>
  );
