/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, object, withKnobs } from '@storybook/addon-knobs';

import withMinWidth from 'stories/decorators/withMinWidth';

import Panel from './index';

storiesOf('components/Panel', module)
  .addDecorator(withMinWidth(400))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Panel>
      <p>{text('children', 'Some content')}</p>
    </Panel>
  ))
  .add('with sections', () => (
    <Panel
      sections={object('sections', [
        { label: 'Section 1', content: 'Content 1' },
        { label: 'Section 2', content: 'Content 2' },
        { label: 'Section 3', content: 'Content 2' },
      ])}
    />
  ))
  .add('with footer', () => (
    <Panel
      sections={object('sections', [
        { label: 'Section 1', content: 'Content 1' },
        { label: 'Section 2', content: 'Content 2' },
        { label: 'Section 3', content: 'Content 2' },
      ])}
      footerRenderer={() => <p>Footer</p>}
    />
  ));
