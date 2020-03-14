import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import DeprecatedStep, { DeprecatedStepProps } from '.';

const getProps = () => {
  const onClick = action('click');

  return {
    onClick,
    isActive: false,
  };
};

const render = (props?: Partial<DeprecatedStepProps>) => (
  <NewBlock name="Deprecated">
    <DeprecatedStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Deprecated Step',
  component: DeprecatedStep,
};

export const normal = render;

export const active = () => render({ isActive: true });
