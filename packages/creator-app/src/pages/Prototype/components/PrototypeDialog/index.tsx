import { BaseRequest, ButtonsLayout } from '@voiceflow/general-types';
import React from 'react';

import Divider from '@/components/Divider';
import * as Prototype from '@/ducks/prototype';

import { Interaction, Message, MessageType } from '../../types';
import { Container, Ended, InlineInteractions, MessagesContainer, StickyInteractions } from './components';
import { Audio, Debug, Loading, Speak, User, Visual } from './components/Message';
import useMessageFilters from './filters';
import { checkIfFirstInSeries } from './utils';

type DialogPrototypeProps = {
  onPlay: (src: string) => void;
  status: Prototype.PrototypeStatus;
  messages: Message[];
  isPublic?: boolean;
  isLoading?: boolean;
  bottomScrollRef: React.Ref<HTMLElement>;
  hideSessionMessages?: boolean;
  isMobile?: boolean;
  showPadding?: boolean;
  color?: string;
  buttons?: ButtonsLayout;
  avatarURL?: string;
  interactions: Interaction[];
  onInteraction: (request: string | BaseRequest) => void;
};

const PrototypeDialog: React.FC<DialogPrototypeProps> = ({
  isPublic,
  bottomScrollRef,
  messages: rawMessages,
  onPlay,
  isLoading,
  status,
  hideSessionMessages,
  showPadding,
  interactions,
  isMobile,
  color,
  buttons = ButtonsLayout.STACKED,
  avatarURL,
  onInteraction,
}) => {
  // filter out messages based on settings
  const messages = useMessageFilters(rawMessages);
  const interactionProps = { color, interactions, onInteraction };

  return (
    <Container isPublic={isPublic} showPadding={showPadding} isMobile={isMobile}>
      <MessagesContainer>
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
                  avatarURL={avatarURL}
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
                  avatarURL={avatarURL}
                />
              );
            case MessageType.DEBUG:
              return <Debug key={message.id} {...message} />;
            case MessageType.USER:
              return <User isFirstInSeries={isFirstInSeries} userSpeak={userSpeak} key={message.id} color={color} {...message} />;
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
                  avatarURL={avatarURL}
                />
              );
            case MessageType.VISUAL:
              return <Visual isFirstInSeries={isFirstInSeries} key={message.id} visual={message} avatarURL={avatarURL} />;
            default:
              return null;
          }
        })}

        {status === Prototype.PrototypeStatus.ENDED && !hideSessionMessages && <Ended messages={messages} />}

        <Loading isLoading={isLoading} avatarURL={avatarURL} />

        {buttons === ButtonsLayout.STACKED && <InlineInteractions {...interactionProps} />}
      </MessagesContainer>

      {buttons === ButtonsLayout.CAROUSEL && <StickyInteractions {...interactionProps} />}

      <span ref={bottomScrollRef} />
    </Container>
  );
};

export default PrototypeDialog;
