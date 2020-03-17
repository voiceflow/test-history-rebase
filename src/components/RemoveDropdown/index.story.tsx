import { action } from '@storybook/addon-actions';
import React from 'react';

import RemoveDropdown from '.';

export default {
  title: 'Remove Dropdown',
  component: RemoveDropdown,
};

export const base = () => <RemoveDropdown onRemove={action('onRemove')} />;
