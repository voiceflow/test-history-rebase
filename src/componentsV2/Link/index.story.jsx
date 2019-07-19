import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';

import Link from '.';

storiesOf('Link', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const label = text('Label', 'Link');
  const onClick = action('click');

  return (
    <>
      <Variant label="primary">
        <Link disabled={disabled} onClick={onClick}>
          {label}
        </Link>
      </Variant>
      <Variant label="secondary">
        <Link variant="secondary" disabled={disabled} onClick={onClick}>
          {label}
        </Link>
      </Variant>
      <Variant label="hidden">
        <Link variant="hidden" disabled={disabled} onClick={onClick}>
          {label}
        </Link>
      </Variant>
    </>
  );
});
