import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import PhonePreview from '.';

storiesOf('Phone Preview', module).add(
  'variants',
  createTestableStory(() => {
    const imageLink = text('Image Link', '/permissions.png');

    return (
      <Variant label="default">
        <PhonePreview image={imageLink} />
      </Variant>
    );
  })
);
