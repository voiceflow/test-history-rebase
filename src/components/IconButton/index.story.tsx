import { action as storybookAction } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import IconButton, { IconButtonVariant } from '.';

const getProps = () => ({
  onClick: storybookAction('click'),
  disabled: boolean('Disabled', false),
});

export default {
  title: 'Icon Button',
  component: IconButton,
};

export const normal = () => <IconButton icon="elipsis" {...getProps()} />;

export const flat = () => <IconButton icon="elipsis" variant={IconButtonVariant.FLAT} {...getProps()} />;

export const action = () => <IconButton icon="elipsis" variant={IconButtonVariant.ACTION} {...getProps()} />;
