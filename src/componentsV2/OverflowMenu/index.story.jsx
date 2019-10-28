import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import OverflowMenu from '.';

const MENU_OPTIONS = Array(4)
  .fill(0)
  .map((_, index) => ({ value: { id: `opt${index + 1}` }, label: `Option ${index + 1}` }));

storiesOf('Overflow Menu', module).add(
  'variants',
  createTestableStory(() => {
    const disabled = boolean('Disabled', false);

    return (
      <Variant label="default">
        <OverflowMenu options={MENU_OPTIONS} disabled={disabled} onSelect={action('select')} />
      </Variant>
    );
  })
);
