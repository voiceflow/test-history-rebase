import { text } from '@storybook/addon-knobs';
import React from 'react';

import Message, { Audio, Loading, Speak, User } from '.';
import { Debug } from './variants/Debug';

export default {
  title: 'Prototype/Message',
  component: Message,
};

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error eum fugit labore natus omnis quaerat quos ut voluptates. Accusamus delectus exercitationem ipsam ipsum itaque modi nesciunt non officiis saepe voluptates!';

const getText = () => text('Content', LOREM_IPSUM);
export const standard = () => <Message iconProps={{ icon: 'api' }}>{getText()}</Message>;

const getAudio = () => text('Audio', 'jamjam.mp3');
export const audio = () => <Audio name={getAudio()} />;

export const user = () => <User input={getText()} />;

const getVoice = () => text('Voice', 'Justin');
export const speak = () => <Speak voice={getVoice()} message={getText()} />;

const getDebug = () => text('Debug Markdown', '**this** is in `markdown` so *you* can ~~format~~ it');
export const debug = () => <Debug message={getDebug()} startTime="10" getDiagram={() => ({ name: 'diagramName' })} />;

export const loading = () => <Loading />;
