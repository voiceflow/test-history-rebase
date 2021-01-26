import React from 'react';

import { withStepContext } from '@/../.storybook';
import Block from '@/pages/Canvas/components/Block';

import { VisualStep, VisualStepProps } from '.';

const VISUAL_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => {
  return {
    label: 'Mobile Mockup',
    image: VISUAL_IMAGE,
    portID: 'visual-block',
    aspectRatio: 0.4618226600985222,
  };
};

export default {
  title: 'Creator/Steps/Visual Step',
  component: VisualStep,
};

const render = (props?: Partial<VisualStepProps>) => () => (
  <Block name="Visual Block">
    <VisualStep {...getProps()} {...props} />
  </Block>
);

export const empty = withStepContext()(render({ label: '', image: '', aspectRatio: null }));

export const withoutImage = withStepContext()(render({ image: '', aspectRatio: null }));

export const withImage = withStepContext()(render({ aspectRatio: null }));

export const withImageAndRatio = withStepContext()(render());

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());

export const withoutPort = withStepContext({ withPorts: false })(render());
