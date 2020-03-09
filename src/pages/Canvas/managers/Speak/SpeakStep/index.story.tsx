import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import React from 'react';

import { withEngine } from '@/../.storybook';
import { PLATFORMS, PlatformType } from '@/constants';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import SpeakStep, { SpeakStepItem } from '.';

const withDispatcher = ({ hasActiveLinks = false, onClick = action('click port') } = {}) =>
  withEngine({
    dispatcher: {
      usePort: () => ({ hasActiveLinks, onClick }),
      useNode: () => ({}),
    },
  });

const getProps = () => {
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
    portID: 'abc',
    items,
    platform,
  };
};

export default {
  title: 'Creator/Steps/Speak Step',
  component: SpeakStep,
};

export const empty = withDispatcher()(() => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} items={[]} />
  </NewBlock>
));

export const singleActive = withDispatcher()(() => {
  const { items, ...props } = getProps();

  return (
    <NewBlock name="Speak Block">
      <SpeakStep items={[items[0]]} {...props} isActive />
    </NewBlock>
  );
});

export const connected = withDispatcher({
  hasActiveLinks: true,
})(() => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} />
  </NewBlock>
));

// eslint-disable-next-line sonarjs/no-identical-functions
export const multiSteps = withDispatcher()(() => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} />
  </NewBlock>
));

export const random = withDispatcher()(() => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} random />
  </NewBlock>
));

export const withoutPort = withDispatcher()(() => (
  <NewBlock name="Speak Block">
    <SpeakStep {...getProps()} random withPort={false} />
  </NewBlock>
));
