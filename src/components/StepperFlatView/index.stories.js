/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { object, boolean, withKnobs } from '@storybook/addon-knobs';

import withMinWidth from 'stories/decorators/withMinWidth';

import StepperFlatView from './index';

storiesOf('components/StepperFlatView', module)
  .addDecorator(withMinWidth(640))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <StepperFlatView
      sections={object('sections', [
        {
          label: 'section 1',
          sections: [
            { label: 'Panel 1', content: 'content 1' },
            null,
            { label: 'Panel 2', content: 'content 2' },
          ],
        },
        {
          label: 'section 2',
          sections: [
            { label: 'Panel 1', content: 'content 1' },
            { label: 'Panel 1', content: <span>this is JSX</span> },
          ],
        },
      ])}
      withButton={boolean('withButton', true)}
      buttonProps={object('buttonProps', { children: 'Some text' })}
    />
  ));
