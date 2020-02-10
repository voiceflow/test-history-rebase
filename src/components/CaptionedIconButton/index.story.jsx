import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';

import CaptionedIconButton from '.';

const getProps = () => ({
  disabled: boolean('Disabled', false),
  onClick: action('click'),
  children: text('Label', 'label'),
});

export default {
  title: 'Captioned Icon Button',
  component: CaptionedIconButton,
};

export const normal = () => <CaptionedIconButton icon="elipsis" {...getProps()} />;
