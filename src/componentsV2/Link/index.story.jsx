import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { FlexAround } from 'componentsV2/Flex';

import Link from '.';

storiesOf('Link', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const label = text('Label', 'Link');
  const onClick = action('click');

  return (
    <FlexAround>
      <Link disabled={disabled} onClick={onClick}>
        {label}
      </Link>
      <Link variant="secondary" disabled={disabled} onClick={onClick}>
        {label}
      </Link>
      <Link variant="hidden" disabled={disabled} onClick={onClick}>
        {label}
      </Link>
    </FlexAround>
  );
});
