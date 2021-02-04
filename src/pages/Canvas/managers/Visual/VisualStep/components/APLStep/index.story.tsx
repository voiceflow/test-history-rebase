import React from 'react';

import { withStepContext } from '@/../.storybook';
import Block from '@/pages/Canvas/components/Block';

import { APLStep, APLStepProps } from '.';

const APL_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => {
  return {
    // withPorts: true,
    portID: 'apl-block',
    label: 'Hi {name}, welcome to Adidas.',
    image: APL_IMAGE,
  };
};

export default {
  title: 'Creator/Steps/Visual/APL Step',
  component: APLStep,
};

const render = (props?: Partial<APLStepProps>) => () => (
  <Block name="APL Block">
    <APLStep {...getProps()} {...props} />
  </Block>
);

export const empty = withStepContext()(render({ label: '', image: '' }));

export const withoutImage = withStepContext()(render({ image: '' }));

export const withImage = withStepContext()(render());

export const longLabel = withStepContext()(render({ label: 'Hi {name}, welcome to Adidas showroom in Seattle.' }));

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const advancedDisplayType = withStepContext()(render({ label: 'Dogs_and_Cats.json', image: '' }));
