import { action } from '@storybook/addon-actions';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';

import DeprecatedStep, { DeprecatedStepProps } from '.';

const getProps = () => {
  const onClick = action('click');

  return {
    onClick,
    isActive: false,
  };
};

const render = (props?: Partial<DeprecatedStepProps>) => (
  <Block name="Deprecated">
    <DeprecatedStep {...getProps()} {...props} />
  </Block>
);

export default {
  title: 'Creator/Steps/Deprecated Step',
  component: DeprecatedStep,
};

export const normal = render;

export const active = () => render({ isActive: true });
