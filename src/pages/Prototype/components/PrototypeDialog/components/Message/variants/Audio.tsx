import React from 'react';

import { getAudioTitle } from '@/utils/audio';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type AudioProps = Omit<MessageProps, 'iconProps'> & {
  name: string;
};

const Audio: React.FC<AudioProps> = ({ name, ...props }) => (
  <Message iconProps={{ icon: 'volume', color: '#f65b6d' }} {...props}>
    {getAudioTitle(name) || 'Audio'}
  </Message>
);

export default Audio;
