import React from 'react';

import Divider from '@/components/Divider';

import { Interaction, Message, MessageType } from '../../types';
import { Container, Interactions } from './components';
import { Audio, Debug, Loading, Speak, Stream, User } from './components/Message';

type DialogProps = {
  debug?: boolean;
  onPlay: (src: string) => void;
  messages: Message[];
  isLoading?: boolean;
  interactions: Interaction[];
  onInteraction: (input: string) => void;
};

const TestingDialog: React.FC<DialogProps> = ({ messages, debug, onPlay, interactions, onInteraction, isLoading }) => {
  return (
    <Container>
      {messages.map((message: Message) => {
        switch (message.type) {
          case MessageType.SESSION:
            return <Divider key={message.id}>{message.message}</Divider>;
          case MessageType.AUDIO:
            return <Audio key={message.id} {...message} onClick={() => onPlay(message.src)} />;
          case MessageType.SPEAK:
            return <Speak key={message.id} {...message} onClick={() => onPlay(message.src)} />;
          case MessageType.DEBUG:
            return debug ? <Debug key={message.id} {...message} /> : null;
          case MessageType.USER:
            return <User key={message.id} {...message} />;
          case MessageType.STREAM:
            return <Stream key={message.id} {...message} />;
          default:
            return null;
        }
      })}
      {isLoading && <Loading />}
      <Interactions interactions={interactions} onInteraction={onInteraction} />
    </Container>
  );
};

export default TestingDialog;
