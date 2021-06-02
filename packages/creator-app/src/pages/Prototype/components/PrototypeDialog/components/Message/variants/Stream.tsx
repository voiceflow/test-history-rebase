import React from 'react';

import { Message } from '../components';
import { MessageProps } from '../components/Message';

type StreamProps = Omit<MessageProps, 'iconProps'> & {
  audio: string;
  duration?: number;
};

const Stream: React.FC<StreamProps> = ({ audio, duration, ...props }) => <Message {...props}>{audio}</Message>;

export default Stream;
