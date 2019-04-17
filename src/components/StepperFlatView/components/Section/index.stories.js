/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, object, withKnobs } from '@storybook/addon-knobs';

import withMinWidth from 'stories/decorators/withMinWidth';

import FlatViewSection from './index';

storiesOf('components/FlatView/Section', module)
  .addDecorator(withMinWidth(640))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <FlatViewSection
      label={text('label', 'Label')}
      sections={object('sections', [
        { label: 'Product Name', content: 'The Cave Quest expansion pack' },
        { label: 'Synonyms', content: 'Pack, Expansion pack, Quest, Cave quest' },
        {
          label: 'Summary Description',
          content:
            'Summary description of the product 160 symbols. Lorem ipsum dolor sit amet,consectetur adipiscing elit.',
        },
      ])}
    />
  ));
