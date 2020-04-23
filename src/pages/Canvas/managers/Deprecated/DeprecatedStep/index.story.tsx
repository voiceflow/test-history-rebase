import React from 'react';

import Block from '@/pages/Canvas/components/Block';

import DeprecatedStep from '.';

const render = () => (
  <Block name="Deprecated">
    <DeprecatedStep />
  </Block>
);

export default {
  title: 'Creator/Steps/Deprecated Step',
  component: DeprecatedStep,
};

export const normal = render;
