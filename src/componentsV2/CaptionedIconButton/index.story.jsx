import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import CaptionedIconButton from '.';

storiesOf('Captioned Icon Button', module).add(
  'variants',
  createTestableStory(() => {
    const disabled = boolean('Disabled', false);
    const onClick = action('click');
    const label = text('Label', 'label');

    return (
      <Variant label="default">
        <CaptionedIconButton icon="elipsis" disabled={disabled} onClick={onClick}>
          {label}
        </CaptionedIconButton>
      </Variant>
    );
  })
);
