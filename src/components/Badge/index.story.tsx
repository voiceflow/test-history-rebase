import { select, text } from '@storybook/addon-knobs';
import React from 'react';

import THEME from '@/styles/theme';

import Badge from '.';

export default {
  title: 'Badge',
  component: Badge,
};

export const badge = () => {
  const children = text('text', 'badge');
  const color = select(
    'color',
    {
      default: '',
      blue: THEME.colors.blue,
      green: THEME.colors.green,
      red: THEME.colors.red,
    },
    'default'
  );
  return <Badge color={color}>{children}</Badge>;
};
