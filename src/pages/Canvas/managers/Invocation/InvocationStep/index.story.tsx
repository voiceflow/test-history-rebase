import React from 'react';

import { withStepContext } from '@/../.storybook';
import { PlatformType } from '@/constants';
import Block from '@/pages/Canvas/components/Block';

import { InvocationStep, InvocationStepProps } from '.';

const getProps = () => ({
  platform: PlatformType.ALEXA,
  projectName: 'Project name',
  invocationName: 'Inv name',
});

export default {
  title: 'Creator/Steps/Invocation Step',
  component: InvocationStep,
};

const render = (props?: Partial<InvocationStepProps>) => () => (
  <Block name="Invocation Block">
    <InvocationStep {...getProps()} {...props} />
  </Block>
);

export const alexa = withStepContext()(render());

export const google = withStepContext()(render({ platform: PlatformType.GOOGLE }));

export const general = withStepContext()(render({ platform: PlatformType.GENERAL }));
