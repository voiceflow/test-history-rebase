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
    label: `Regular Option ${index + 1}`,
  }));

const TWO_NEST_OPTIONS = Array(4)
  .fill(0)
  .map((_, index) => ({
    label: `Parent Option ${index + 1}`,
    options: Array(5)
      .fill(0)
      .map((_, idx) => ({
        value: {
          id: `opt${idx + 1}`,
        },
        label: `Option ${idx + 1}`,
      })),
  }));

const MULTI_LEVEL_OPTIONS = Array(5)
  .fill(0)
  .map((_, idx1) => ({
    value: `Parent option ${idx1 + 1}`,
    label: `Parent Option ${idx1 + 1}`,
    nestedOptions: Array(4)
      .fill(0)
      .map((_, idx2) => ({
        value: `Parent ${idx1 + 1} sub-parent ${idx2 + 1}`,
        label: `Parent ${idx1 + 1} Sub-Parent ${idx2 + 1}`,
        nestedOptions: Array(idx1 + 1)
          .fill(0)
          .map((_, idx3) => ({
            value: `Option ${idx3 + 1}`,
            label: `Option ${idx3 + 1}`,
          })),
      }))
      .concat(MENU_OPTIONS),
  }))
  .concat(MENU_OPTIONS);

storiesOf('Dropdown Menus', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const icon = text('Icon', 'back');
  const label = text('Label', 'label');
  const actionText = text('Action Text', 'Action Link');
  const onSelect = action('select');
  const onClear = action('clear');
  const actionClick = action('action');

  return (
    <>
      <Variant label="2-Level Nested">
        <DropdownContainer>
          <Dropdown options={TWO_NEST_OPTIONS} disabled={disabled} onSelect={onSelect} />
        </DropdownContainer>
      </Variant>
      <Variant label="Multi-level Expandable">
        <DropdownContainer>
          <Dropdown isExpandable options={MULTI_LEVEL_OPTIONS} label={label} onClear={onClear} disabled={disabled} onSelect={onSelect} />
        </DropdownContainer>
      </Variant>
      <Variant label="Actions">
        <DropdownContainer>
          <Dropdown options={MENU_OPTIONS} actionClick={actionClick} actionText={actionText} icon={icon} disabled={disabled} onSelect={onSelect} />
        </DropdownContainer>
      </Variant>
    </>
  );
});
