/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import { text, object, withKnobs } from '@storybook/addon-knobs';

import { FeatureFlagContextProvider } from 'contexts';
import withMinWidth from 'stories/decorators/withMinWidth';

import FeatureFlag from './index';

storiesOf('components/FeatureFlag', module)
  .addDecorator(withMinWidth(400))
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <FeatureFlagContextProvider
      value={object('availableFeatures', ['feature1', 'feature2', 'feature3'])}
    >
      <FeatureFlag flag={text('flags', '')}>
        <p>{text('children', 'Some content')}</p>
      </FeatureFlag>
    </FeatureFlagContextProvider>
  ))
  .add('with names', () => (
    <FeatureFlagContextProvider
      value={object('availableFeatures', ['feature1', 'feature2', 'feature3'])}
    >
      <FeatureFlag flag={text('flags', 'feature1')}>
        <p>{text('children', 'Some content')}</p>
      </FeatureFlag>
    </FeatureFlagContextProvider>
  ));
