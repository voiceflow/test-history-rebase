import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import PlusIcon from 'svgs/plus.svg';
import SyncIcon from 'svgs/sync.svg';

import { FlexAround } from 'componentsV2/Flex';

import Button from '.';

storiesOf('Button', module)
  .add('variants', () => {
    const disabled = boolean('Disabled', false);
    const label = text('Label', 'Button');
    const onClick = action('click');

    return (
      <FlexAround>
        <Button disabled={disabled} onClick={onClick}>
          {label}
        </Button>
        <Button variant="secondary" disabled={disabled} onClick={onClick}>
          {label}
        </Button>
        <Button variant="tertiary" disabled={disabled} onClick={onClick}>
          {label}
        </Button>
      </FlexAround>
    );
  })
  .add('variants - with icon', () => {
    const disabled = boolean('Disabled', false);
    const label = text('Label', 'Button');
    const onClick = action('click');

    return (
      <FlexAround>
        <Button icon={PlusIcon} disabled={disabled} onClick={onClick}>
          {label}
        </Button>
        <Button variant="secondary" icon={SyncIcon} disabled={disabled} onClick={onClick}>
          {label}
        </Button>
      </FlexAround>
    );
  });
