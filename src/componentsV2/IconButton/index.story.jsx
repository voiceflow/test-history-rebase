import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';

import IconButton from '.';

storiesOf('Icon Button', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const onClick = action('click');

  return (
    <>
      <Variant label="normal">
        <IconButton icon="elipsis" disabled={disabled} onClick={onClick} />
      </Variant>
      <Variant label="flat">
        <IconButton icon="elipsis" variant="flat" disabled={disabled} onClick={onClick} />
      </Variant>
      <Variant label="action">
        <IconButton icon="elipsis" variant="action" disabled={disabled} onClick={onClick} />
      </Variant>
    </>
  );
});
