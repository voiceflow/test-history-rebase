import { select } from '@storybook/addon-knobs';
import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import { PLATFORMS, PlatformType } from '@/constants';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { SpeakStep, SpeakStepItem, SpeakStepProps } from '.';

const ITEMS: SpeakStepItem[] = [
  { content: 'Welcome to Voiceflow, the best way to design, prototype and build conversational interfaces.' },
  { content: 'man_breathing_heavily(loud).mp3', isAudio: true },
  {
    content:
      'Welcome to Voiceflow, the best way to design, prototype and build conversational interfaces. Welcome to Voiceflow, the best way to design.',
  },
];

const getProps = () => {
  const platform = select('platform', PLATFORMS, PlatformType.ALEXA);

  return {
    platform,
    portID: 'abc',
    items: ITEMS,
    withPorts: true,
  };
};

// eslint-disable-next-line sonarjs/no-identical-functions
const render = (props?: Partial<SpeakStepProps>) => () => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Speak Step',
  component: SpeakStep,
};

export const empty = withStepDispatcher()(render({ items: [] }));

export const singleActive = withStepDispatcher()(render({ items: [ITEMS[0]], isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());

export const multiSteps = withStepDispatcher()(render());

export const random = withStepDispatcher()(render({ random: true }));

export const withoutPort = withStepDispatcher()(render({ withPorts: false }));
