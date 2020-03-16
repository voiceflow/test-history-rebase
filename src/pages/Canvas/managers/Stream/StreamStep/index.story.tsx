import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
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

export const emptyGoogle = withStepDispatcher()(render({ audio: undefined, platform: PlatformType.GOOGLE }));

export const emptyAlexa = withStepDispatcher()(render({ audio: undefined }));

export const withAudioAdded = withStepDispatcher()(render());

export const withCustomPause = withStepDispatcher()(render({ customPause: true }));

export const active = withStepDispatcher()(render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
