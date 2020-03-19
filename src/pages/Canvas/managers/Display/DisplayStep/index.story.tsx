import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { DisplayStep, DisplayStepProps } from '.';

const DISPLAY_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => {
  return {
    withPorts: true,
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

export const empty = withStepDispatcher()(render({ label: '', image: '' }));

export const withoutImage = withStepDispatcher()(render({ image: '' }));

export const withImage = withStepDispatcher()(render());

export const longLabel = withStepDispatcher()(render({ label: 'Hi {name}, welcome to Adidas showroom in Seattle.' }));

export const active = withStepDispatcher()(render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());

export const withoutPort = withStepDispatcher()(render({ withPorts: false }));

export const advancedDisplayType = withStepDispatcher()(render({ label: 'Dogs_and_Cats.json', image: '' }));
