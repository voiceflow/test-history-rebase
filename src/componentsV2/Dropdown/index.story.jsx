import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';

import Dropdown from '.';

const MENU_OPTIONS = Array(4)
  .fill(0)
  .map((_, index) => ({
    value: {
      id: `opt${index + 1}`,
    },
    label: `Option ${index + 1}`,
  }));

storiesOf('Regular Dropdown', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const icon = text('Icon', 'back');
  const label = text('Label', 'label');
  const onSelect = action('select');

  return (
    <>
      <Variant label="Regular">
        <Dropdown options={MENU_OPTIONS} size="240px" disabled={disabled} onSelect={onSelect} />
      </Variant>
      <Variant label="Labelled">
        <Dropdown options={MENU_OPTIONS} size="240px" label={label} disabled={disabled} onSelect={onSelect} />
      </Variant>
      <Variant label="Iconed">
        <Dropdown options={MENU_OPTIONS} size="240px" icon={icon} disabled={disabled} onSelect={onSelect} />
      </Variant>
    </>
  );
});
