import { text } from '@storybook/addon-knobs';
import React from 'react';

import Divider from '.';

export default {
  title: 'Divider',
  component: Divider,
};

export const normal = () => (
  <div style={{ width: 200 }}>
    <Divider />
  </div>
);

export const withLabel = () => {
  const label = text('Label', 'Button');

  return (
    <div style={{ width: 200 }}>
      <Divider>{label}</Divider>
    </div>
  );
};
