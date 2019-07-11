import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { FlexAround } from 'componentsV2/Flex';

import DropdownButton from '.';

storiesOf('Dropdown Button', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const label = text('Label', 'Dropdown Button');
  const onClick = action('click');

  return (
    <FlexAround>
      <DropdownButton options={[]} disabled={disabled} onClick={onClick}>
        {label}
      </DropdownButton>
      <DropdownButton variant="secondary" options={[]} disabled={disabled} onClick={onClick}>
        {label}
      </DropdownButton>
    </FlexAround>
  );
});
