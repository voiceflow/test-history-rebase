import React from 'react';

import Divider from '@/components/Divider';
import { TAudio } from '@/pages/Prototype/PrototypeTool/Audio';

import { Message, MessageType } from '../../types';
import { Container } from './components';
import { Audio, Debug, Loading, Speak, User } from './components/Message';
import { checkIfFirstInSeries } from './utils';

type DialogProps = {
  debug?: boolean;
  onPlay: (src: string) => void;
  messages: Message[];
  isLoading?: boolean;
  onInteraction: (input: string) => void;
  audioInstance: TAudio | null;
  setForceAutoUpdate: (val: number) => void;
  bottomScrollRef: React.Ref<HTMLElement>;
  isPublic?: boolean;
};

const PrototypeDialog: React.FC<DialogProps> = ({
  setForceAutoUpdate,
  isPublic,
  bottomScrollRef,
  audioInstance,
  messages,
  debug,
  onPlay,
  isLoading,
}) => {
  return (
    <Container isPublic={isPublic}>
      {messages.map((message: Message, index) => {
        const previousMessage = messages[index - 1];
        const userSpeak = message.type === MessageType.USER;
        const isFirstInSeries = checkIfFirstInSeries(previousMessage, message);
        const isCurrent = message === messages[messages.length - 1];
        const isLast = index === messages.length - 1;

        switch (message.type) {
          case MessageType.SESSION:
            return (
              <Divider key={message.id} isLast={isLast && messages.length > 1}>
                {message.message}
              </Divider>
            );
          case MessageType.AUDIO:
            return (
              <Audio
                userSpeak={userSpeak}
                isFirstInSeries={isFirstInSeries}
                key={message.id}
                {...message}
                audioSrc={message.src}
                onPlay={() => onPlay(message.src)}
                isCurrent={isCurrent}
                audioInstance={audioInstance}
                setForceAutoUpdate={setForceAutoUpdate}
                isLast={isLast}
              />
            );
          case MessageType.SPEAK:
            return (
              <Speak
                isFirstInSeries={isFirstInSeries}
                key={message.id}
                userSpeak={userSpeak}
                {...message}
                onClick={() => onPlay(message.src)}
                isLast={isLast}
              />
            );
          case MessageType.DEBUG:
            return debug ? <Debug key={message.id} {...message} /> : null;
          case MessageType.USER:
            return <User isFirstInSeries={isFirstInSeries} userSpeak={userSpeak} key={message.id} {...message} />;
          case MessageType.STREAM:
            return (
              <Audio
                userSpeak={userSpeak}
                name=""
                isFirstInSeries={isFirstInSeries}
                key={message.id}
                audioSrc={message.audio}
                {...message}
                onPlay={() => onPlay(message.audio)}
                isCurrent={isCurrent}
                audioInstance={audioInstance}
                setForceAutoUpdate={setForceAutoUpdate}
                isLast={isLast}
              />
            );
          default:
            return null;
        }
      })}
      <Loading isLoading={isLoading} />
      <span ref={bottomScrollRef} />
    </Container>
  );
};

export default PrototypeDialog;
