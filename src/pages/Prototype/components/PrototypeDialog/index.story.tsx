import { action } from '@storybook/addon-actions';
import React from 'react';

import { Message, MessageType } from '../../types';
import Dialog from '.';

export default {
  title: 'Prototype/Dialog',
  component: Dialog,
};

const messages: Message[] = [
  {
    id: '1',
    type: MessageType.SESSION,
    message: 'Session started',
    startTime: '00:00',
  },
  {
    id: '2',
    src: 'src.mp3',
    type: MessageType.SPEAK,
    voice: 'Kendra',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nibh risus, feugiat ut nibh eget, pulvinar sollicitudin erat. Do you want to go left or right',
    startTime: '00:00',
  },
  {
    id: '3',
    type: MessageType.USER,
    input: 'I want to go right',
    startTime: '00:00',
  },
  {
    id: '4',
    type: MessageType.DEBUG,
    message: 'Choice Block `Right Intent` **Path 3**',
    startTime: '00:00',
  },
  {
    id: '5',
    src: 'src.mp3',
    type: MessageType.SPEAK,
    message: 'sure going right',
    startTime: '00:00',
  },
  {
    id: '6',
    src: 'src.mp3',
    type: MessageType.AUDIO,
    name: 'spooky_music.mp3',
    startTime: '00:00',
  },
  {
    id: '7',
    type: MessageType.USER,
    input: 'That is very spooky',
    startTime: '00:00',
  },
];

const interactions = [{ name: 'left' }, { name: 'right' }, { name: 'up' }, { name: 'down' }];

export const basic = () => <Dialog messages={messages} onPlay={action('action')} onInteraction={action('interaction')} interactions={interactions} />;

export const debug = () => (
  <Dialog debug messages={messages} onPlay={action('action')} onInteraction={action('interaction')} interactions={interactions} />
);

export const loading = () => (
  <Dialog messages={messages} onPlay={action('action')} onInteraction={action('interaction')} interactions={interactions} isLoading />
);
