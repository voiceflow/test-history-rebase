import React from 'react';

import Block from '@/pages/Canvas/components/Block';

import InvalidPlatformStep from '.';

const render = () => (
  <Block name="Invalid Platform">
    <InvalidPlatformStep />
  </Block>
);

export default {
  title: 'Creator/Steps/Invalid Platform Step',
  component: InvalidPlatformStep,
};

export const normal = render;
