import { action } from '@storybook/addon-actions';
import React from 'react';

import Start from '.';

export default {
  title: 'Testing/Start',
  component: Start,
};

export const base = () => <Start start={action('start')} />;
