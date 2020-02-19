import React from 'react';

import { PlatformType } from '@/constants';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import ExitStep from '.';

const getProps = () => ({
  platform: PlatformType.ALEXA,
});

export default {
  title: 'Creator/Steps/Exit Step',
  component: ExitStep,
};
export const alexa = () => (
  <NewBlock name="Exit Block">
    <ExitStep {...getProps()} />
  </NewBlock>
);

export const google = () => (
  <NewBlock name="Exit Block">
    <ExitStep platform={PlatformType.GOOGLE} />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Exit Block">
    <ExitStep {...getProps()} isActive />
  </NewBlock>
);
