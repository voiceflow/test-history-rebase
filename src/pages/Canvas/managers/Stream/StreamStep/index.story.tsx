import React from 'react';

import { withStepContext } from '@/../.storybook';
import { PlatformType } from '@/constants';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { StreamStep, StreamStepProps } from '.';

const getProps = () => {
  return {
    audio: 'How_to_train_your_dragon.mp3',
    withPorts: true,
    portIDs: ['abc', 'def', 'ghi', 'jkl'],
    customPause: false,
    platform: PlatformType.ALEXA,
  };
};

const render = (props?: Partial<StreamStepProps>) => () => (
  <NewBlock name="Payment Block">
    <StreamStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Stream Step',
  component: StreamStep,
};

export const emptyGoogle = withStepContext()(render({ audio: undefined, platform: PlatformType.GOOGLE }));

export const emptyAlexa = withStepContext()(render({ audio: undefined }));

export const withAudioAdded = withStepContext()(render());

export const withCustomPause = withStepContext()(render({ customPause: true }));

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
