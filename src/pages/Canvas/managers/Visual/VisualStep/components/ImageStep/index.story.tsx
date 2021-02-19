import { withStepContext } from '_storybook';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';

import { ImageStep, ImageStepProps } from '.';

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
  title: 'Creator/Steps/Visual/Image Step',
  component: ImageStep,
};

const render = (props?: Partial<ImageStepProps>) => () => (
  <Block name="Image Block">
    <ImageStep {...getProps()} {...props} />
  </Block>
);

export const empty = withStepContext()(render({ label: '', image: '', aspectRatio: null }));

export const withoutImage = withStepContext()(render({ image: '', aspectRatio: null }));

export const withImage = withStepContext()(render({ aspectRatio: null }));

export const withImageAndRatio = withStepContext()(render());

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());

export const withoutPort = withStepContext({ withPorts: false })(render());
