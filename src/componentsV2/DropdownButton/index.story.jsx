import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';

import DropdownButton from '.';

storiesOf('Dropdown Button', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const label = text('Label', 'Dropdown Button');
  const onClick = action('click');

  return (
    <>
      <Variant label="primary">
        <DropdownButton options={[]} disabled={disabled} onClick={onClick}>
          {label}
        </DropdownButton>
      </Variant>
      <Variant label="secondary">
        <DropdownButton variant="secondary" options={[]} disabled={disabled} onClick={onClick}>
          {label}
        </DropdownButton>
      </Variant>
    </>
  );
});
