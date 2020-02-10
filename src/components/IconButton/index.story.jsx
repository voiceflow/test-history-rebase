import { action as storybookAction } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import IconButton from '.';

const getProps = () => ({
  disabled: boolean('Disabled', false),
  onClick: storybookAction('click'),
});

export default {
  title: 'Icon Button',
  component: IconButton,
};

export const normal = () => <IconButton icon="elipsis" {...getProps()} />;

export const flat = () => <IconButton icon="elipsis" variant="flat" {...getProps()} />;

export const action = () => <IconButton icon="elipsis" variant="action" {...getProps()} />;
