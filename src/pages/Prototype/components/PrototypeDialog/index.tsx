import React from 'react';

import Divider from '@/components/Divider';
import * as Prototype from '@/ducks/prototype';

import { Message, MessageType } from '../../types';
import { Container, Ended } from './components';
import { Audio, Debug, Loading, Speak, User } from './components/Message';
import { checkIfFirstInSeries } from './utils';

type DialogPrototypeProps = {
  debug?: boolean;
  onPlay: (src: string) => void;
  status: Prototype.PrototypeStatus;
  messages: Message[];
  isPublic?: boolean;
  isLoading?: boolean;
  bottomScrollRef: React.Ref<HTMLElement>;
  hideSessionMessages?: boolean;
  isMobile?: boolean;
  showPadding?: boolean;
  withInteractions?: boolean;
};

const PrototypeDialog: React.FC<DialogPrototypeProps> = ({
  isPublic,
  bottomScrollRef,
  messages,
  debug,
  onPlay,
  isLoading,
  status,
  hideSessionMessages,
  showPadding,
  isMobile,
}) => (
  <Container isPublic={isPublic} showPadding={showPadding} isMobile={isMobile}>
    {messages.map((message: Message, index) => {
      const previousMessage = messages[index - 1];
      const userSpeak = message.type === MessageType.USER;
      const isFirstInSeries = checkIfFirstInSeries(previousMessage, message);
      const isCurrent = message === messages[messages.length - 1];
      const isLast = index === messages.length - 1;

      switch (message.type) {
        case MessageType.SESSION:
          return hideSessionMessages ? null : (
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
              audioSrc={message.src ?? ''}
              onPlay={() => onPlay(message.src ?? '')}
              isCurrent={isCurrent}
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
              onClick={() => onPlay(message.src ?? '')}
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
              isLast={isLast}
            />
          );
        default:
          return null;
      }
    })}
    {status === Prototype.PrototypeStatus.ENDED && !hideSessionMessages && <Ended messages={messages} />}
    <Loading isLoading={isLoading} />
    <span ref={bottomScrollRef} />
  </Container>
);

export default PrototypeDialog;
