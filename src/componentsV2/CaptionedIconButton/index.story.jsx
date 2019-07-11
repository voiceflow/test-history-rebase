import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import EllipsisIcon from 'svgs/elipsis.svg';

import { FlexAround } from '../Flex';
import CaptionedIconButton from '.';

storiesOf('Captioned Icon Button', module).add('variants', () => {
  const disabled = boolean('Disabled', false);
  const onClick = action('click');
  const label = text('Label', 'label');

  return (
    <FlexAround>
      <CaptionedIconButton icon={EllipsisIcon} disabled={disabled} onClick={onClick}>
        {label}
      </CaptionedIconButton>
    </FlexAround>
  );
});
