import React from 'react';

import ImageIcon from '.';

export default {
  title: 'Image Icon',
  component: ImageIcon,
};

export const normal = () => <ImageIcon />;
export const custom = () => <ImageIcon background="/logo_bubble_Small.png" size={100} />;
