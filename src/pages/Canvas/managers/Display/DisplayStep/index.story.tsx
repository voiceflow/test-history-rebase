import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { DisplayStep, DisplayStepProps } from '.';

const DISPLAY_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => {
  return {
    // withPorts: true,
    portID: 'display-block',
    label: 'Hi {name}, welcome to Adidas.',
    image: DISPLAY_IMAGE,
  };
};

export default {
  title: 'Creator/Steps/Display Step',
  component: DisplayStep,
};

const render = (props?: Partial<DisplayStepProps>) => () => (
  <NewBlock name="Display Block">
    <DisplayStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepContext()(render({ label: '', image: '' }));

export const withoutImage = withStepContext()(render({ image: '' }));

export const withImage = withStepContext()(render());

export const longLabel = withStepContext()(render({ label: 'Hi {name}, welcome to Adidas showroom in Seattle.' }));

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const advancedDisplayType = withStepContext()(render({ label: 'Dogs_and_Cats.json', image: '' }));
