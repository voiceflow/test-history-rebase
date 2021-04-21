import React from 'react';

import { wordmarkDark } from '@/assets';

import ImageIcon from '.';

export default {
  title: 'Image Icon',
  component: ImageIcon,
};

export const normal = () => <ImageIcon />;
export const custom = () => <ImageIcon background={wordmarkDark} size={100} />;
