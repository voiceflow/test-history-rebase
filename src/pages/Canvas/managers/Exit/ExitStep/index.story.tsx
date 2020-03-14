import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import { PlatformType } from '@/constants';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { ExitStep, ExitStepProps } from '.';

const getProps = () => ({
  platform: PlatformType.ALEXA,
  isActive: false,
  withPorts: false,
});

export default {
  title: 'Creator/Steps/Exit Step',
  component: ExitStep,
};

const render = (props?: Partial<ExitStepProps>) => () => (
  <NewBlock name="Exit Block">
    <ExitStep {...getProps()} {...props} />
  </NewBlock>
);

export const alexa = withStepDispatcher()(render());
export const google = withStepDispatcher()(render({ platform: PlatformType.GOOGLE }));
export const active = withStepDispatcher()(render({ isActive: true }));
