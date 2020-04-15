import React from 'react';

import { withStepContext } from '@/../.storybook';
import { PlatformType } from '@/constants';
import Block from '@/pages/Canvas/components/Block';

import { ExitStep, ExitStepProps } from '.';

const getProps = () => ({
  platform: PlatformType.ALEXA,
});

export default {
  title: 'Creator/Steps/Exit Step',
  component: ExitStep,
};

const render = (props?: Partial<ExitStepProps>) => () => (
  <Block name="Exit Block">
    <ExitStep {...getProps()} {...props} />
  </Block>
);

export const alexa = withStepContext()(render());

export const google = withStepContext()(render({ platform: PlatformType.GOOGLE }));

export const active = withStepContext({ isActive: true })(render());
