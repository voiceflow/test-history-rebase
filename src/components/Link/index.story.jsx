import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';

import Link from '.';

const getProps = () => ({
  disabled: boolean('Disabled', false),
  children: text('Label', 'Link'),
  onClick: action('click'),
});

export default {
  title: 'Link',
  component: Link,
  includeStories: [],
};

export const primary = () => <Link {...getProps()} />;

export const secondary = () => <Link variant="secondary" {...getProps()} />;

export const hidden = () => <Link variant="hidden" {...getProps()} />;
