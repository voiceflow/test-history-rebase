import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import Title from '.';

storiesOf('Title', module).add(
  'variants',
  createTestableStory(() => {
    const label = text('Label', 'Title');

    return (
      <>
        <Variant label="heading">
          <Title>{label}</Title>
        </Variant>

        <Variant label="subheading">
          <Title variant="subheading">{label}</Title>
        </Variant>

        <Variant label="subtitle">
          <Title variant="subtitle">{label}</Title>
        </Variant>

        <Variant label="label">
          <Title variant="label">{label}</Title>
        </Variant>
      </>
    );
  })
);
