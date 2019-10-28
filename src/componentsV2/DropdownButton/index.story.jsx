import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import DropdownButton from '.';

const MENU_OPTIONS = Array(4)
  .fill(0)
  .map((_, index) => ({ value: { id: `opt${index + 1}` }, label: `Option ${index + 1}` }));

storiesOf('Dropdown Button', module).add(
  'variants',
  createTestableStory(() => {
    const disabled = boolean('Disabled', false);
    const label = text('Label', 'Dropdown Button');
    const onSelect = action('select');

    return (
      <>
        <Variant label="primary">
          <DropdownButton options={MENU_OPTIONS} disabled={disabled} onSelect={onSelect}>
            {label}
          </DropdownButton>
        </Variant>

        <Variant label="secondary">
          <DropdownButton variant="secondary" options={MENU_OPTIONS} disabled={disabled} onSelect={onSelect}>
            {label}
          </DropdownButton>
        </Variant>
      </>
    );
  })
);
