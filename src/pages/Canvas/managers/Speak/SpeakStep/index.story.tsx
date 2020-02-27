import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import React from 'react';

import { PLATFORMS, PlatformType } from '@/constants';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import SpeakStep, { SpeakStepItem } from '.';

const getProps = () => {
  const onClickPort = action('click port');
  const platform = select('platform', PLATFORMS, PlatformType.ALEXA);
  const items: SpeakStepItem[] = [
    { label: 'Welcome to Voiceflow, the best way to design, prototype and build conversational interfaces.' },
    { label: 'man_breathing_heavily(loud).mp3', isAudio: true },
    {
      label:
        'Welcome to Voiceflow, the best way to design, prototype and build conversational interfaces. Welcome to Voiceflow, the best way to design.',
    },
  ];

  return {
    items,
    platform,
    onClickPort,
  };
};

export default {
  title: 'Creator/Steps/Speak Step',
  component: SpeakStep,
};

export const empty = () => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} items={[]} />
  </NewBlock>
);

export const singleActive = () => {
  const { items, ...props } = getProps();

  return (
    <NewBlock name="Speak Block">
      <SpeakStep items={[items[0]]} {...props} isActive />
    </NewBlock>
  );
};

export const multiSteps = () => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} isConnected />
  </NewBlock>
);

export const random = () => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} random isConnected />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} random withPort={false} />
  </NewBlock>
);
