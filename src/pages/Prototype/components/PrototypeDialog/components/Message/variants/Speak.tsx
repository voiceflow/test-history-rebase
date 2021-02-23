import React from 'react';

import { SSML_TAG_REGEX } from '@/constants';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type SpeakProps = Omit<MessageProps, 'iconProps'> & {
  voice?: string;
  message: string;
};

const Speak: React.FC<SpeakProps> = ({ voice, message, ...props }) => {
  const noSSMLMessage = message.replace(SSML_TAG_REGEX, '');
  return noSSMLMessage ? <Message {...props}>{noSSMLMessage}</Message> : null;
};

export default Speak;
