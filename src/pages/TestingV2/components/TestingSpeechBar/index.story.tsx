import { action } from '@storybook/addon-actions';
import React from 'react';

import SpeechBar, { TestingSpeechBarProps } from '.';

export default {
  title: 'Testing/SpeechBar',
  component: SpeechBar,
};

const createStory = (props?: Pick<TestingSpeechBarProps, 'isPublic'>) => () => (
  <SpeechBar locale="en-US" onTranscript={action('onTranscript')} onToggleListening={action('onToggleListening')} {...props} />
);

export const base = createStory();

export const publicBar = createStory({ isPublic: true });
