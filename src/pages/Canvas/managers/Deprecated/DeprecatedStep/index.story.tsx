import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import DeprecatedStep from '.';

const getProps = () => {
  const onClick = action('click');

  return {
    onClick,
  };
};

export default {
  title: 'Creator/Steps/Deprecated Step',
  component: DeprecatedStep,
};

export const normal = () => (
  <NewBlock name="Deprecated">
    <DeprecatedStep {...getProps()} />
  </NewBlock>
);
