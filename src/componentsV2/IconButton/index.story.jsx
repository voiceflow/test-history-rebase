import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import EllipsisIcon from 'svgs/elipsis.svg';

import { FlexAround } from '../Flex';
import IconButton from '.';

storiesOf('Icon Button', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const onClick = action('click');

  return (
    <FlexAround>
      <IconButton icon={EllipsisIcon} disabled={disabled} onClick={onClick} />
      <IconButton icon={EllipsisIcon} variant="flat" disabled={disabled} onClick={onClick} />
      <IconButton icon={EllipsisIcon} variant="action" disabled={disabled} onClick={onClick} />
    </FlexAround>
  );
});
