import { action } from '@storybook/addon-actions';
import React from 'react';

import Reset from '.';

export default {
  title: 'Prototype/Reset',
  component: Reset,
};

export const base = () => <Reset onClick={action('onClick')} />;
