import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { DropdownContainer } from '@/../.storybook/Containers';
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

storiesOf('Search Dropdowns', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const icon = text('Icon', 'back');
  const label = text('Label', 'label');
  const onSelect = action('select');
  const onClear = action('clear');

  return (
    <>
      <Variant label="Regular">
        <DropdownContainer>
          <Dropdown options={MENU_OPTIONS} disabled={disabled} onSelect={onSelect} />
        </DropdownContainer>
      </Variant>
      <Variant label="Optional">
        <DropdownContainer>
          <Dropdown options={MENU_OPTIONS} label={label} onClear={onClear} disabled={disabled} onSelect={onSelect} />
        </DropdownContainer>
      </Variant>
      <Variant label="Borderless">
        <DropdownContainer>
          <Dropdown options={MENU_OPTIONS} variant="borderless" icon={icon} disabled={disabled} onSelect={onSelect} />
        </DropdownContainer>
      </Variant>
    </>
  );
});
