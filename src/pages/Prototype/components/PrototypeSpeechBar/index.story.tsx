import { action } from '@storybook/addon-actions';
import React from 'react';

import SpeechBar, { PrototypeSpeechBarProps } from '.';

export default {
  title: 'Prototype/SpeechBar',
  component: SpeechBar,
};

const createStory = (props?: Pick<PrototypeSpeechBarProps, 'isPublic'>) => () => (
  <SpeechBar locale="en-US" onTranscript={action('onTranscript')} {...props} />
);

export const base = createStory();

export const publicBar = createStory({ isPublic: true });
