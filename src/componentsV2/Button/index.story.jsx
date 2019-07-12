import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';
import PlusIcon from '@/svgs/plus.svg';
import SyncIcon from '@/svgs/sync.svg';

import Button from '.';

storiesOf('Button', module)
  .add('variants', () => {
    const disabled = boolean('Disabled', false);
    const label = text('Label', 'Button');
    const onClick = action('click');

    return (
      <>
        <Variant label="primary">
          <Button disabled={disabled} onClick={onClick}>
            {label}
          </Button>
        </Variant>
        <Variant label="secondary">
          <Button variant="secondary" disabled={disabled} onClick={onClick}>
            {label}
          </Button>
        </Variant>
        <Variant label="tertiary">
          <Button variant="tertiary" disabled={disabled} onClick={onClick}>
            {label}
          </Button>
        </Variant>
      </>
    );
  })
  .add('variants - with icon', () => {
    const disabled = boolean('Disabled', false);
    const label = text('Label', 'Button');
    const onClick = action('click');

    return (
      <>
        <Variant label="primary">
          <Button icon={PlusIcon} disabled={disabled} onClick={onClick}>
            {label}
          </Button>
        </Variant>
        <Variant label="secondary">
          <Button variant="secondary" icon={SyncIcon} disabled={disabled} onClick={onClick}>
            {label}
          </Button>
        </Variant>
      </>
    );
  });
