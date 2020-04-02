import { select } from '@storybook/addon-knobs';
import React from 'react';

import { withStepContext } from '@/../.storybook';
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

export const empty = withStepContext()(render({ items: [] }));

export const singleActive = withStepContext({ isActive: true })(render({ items: [ITEMS[0]] }));

export const connected = withStepContext({ isConnected: true })(render());

export const multiSteps = withStepContext()(render());

export const random = withStepContext()(render({ random: true }));

export const withoutPort = withStepContext({ withPorts: false })(render());
