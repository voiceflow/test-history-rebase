import { BaseRequest, ButtonsLayout } from '@voiceflow/general-types';
import React from 'react';

import Divider from '@/components/Divider';
import * as Prototype from '@/ducks/prototype';

import { Interaction, Message, MessageType, UserMessage } from '../../types';
import { Container, Ended, InlineInteractions, MessagesContainer, StickyInteractions } from './components';
import { Audio, Debug, IntentConfidence, Loading, Speak, Text, User, Visual } from './components/Message';
import useMessageFilters from './filters';
import { checkIfFirstInSeries } from './utils';

interface DialogPrototypeProps {
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
  stepBack: () => void;
  isTranscript?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  setFocusedTurnID: (turnID: string | null) => void;
  focusedTurnID: string | null;
}

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
  stepBack,
  isTranscript = false,
  onScroll,
  setFocusedTurnID,
  focusedTurnID,
}) => {
  // filter out messages based on settings
  const messages = useMessageFilters(rawMessages);
  const interactionProps = { color, interactions, onInteraction };

  return (
    <Container onScroll={onScroll} isPublic={isPublic} showPadding={showPadding} isMobile={isMobile}>
      <MessagesContainer>
        {isTranscript && <Divider style={{ marginTop: '-30px' }}>Conversation Started</Divider>}

        {messages.map((message: Message, index) => {
          const previousMessage = messages[index - 1];
          const userSpeak = message.type === MessageType.USER;

          const isFirstInSeries = checkIfFirstInSeries(previousMessage, message);
          const isCurrent = message === messages[messages.length - 1];
          const isLast = index === messages.length - 1;
          const isIntentConfidence = message.type === MessageType.DEBUG && message.message.startsWith('matched intent');

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
                  allowPause={isTranscript}
                  autoplay={!isTranscript}
                />
              );
            case MessageType.TEXT:
              return (
                <Text userSpeak={userSpeak} isFirstInSeries={isFirstInSeries} key={message.id} {...message} isLast={isLast} avatarURL={avatarURL} />
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
              return isIntentConfidence ? (
                <IntentConfidence
                  setFocusedTurnID={setFocusedTurnID}
                  focusedTurnID={focusedTurnID}
                  isTranscript={isTranscript}
                  key={message.id}
                  lastUserMessage={messages[index - 1] as UserMessage}
                  {...message}
                />
              ) : (
                <Debug key={message.id} {...message} />
              );
            case MessageType.USER:
              return (
                <User
                  turnID={message.turnID}
                  focusedTurnID={focusedTurnID}
                  isFirstInSeries={isFirstInSeries}
                  userSpeak={userSpeak}
                  key={message.id}
                  color={color}
                  {...message}
                />
              );
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
                  allowPause={isTranscript}
                  autoplay={!isTranscript}
                />
              );
            case MessageType.VISUAL:
              return <Visual isTranscript isFirstInSeries={isFirstInSeries} key={message.id} visual={message} avatarURL={avatarURL} />;
            default:
              return null;
          }
        })}

        {status === Prototype.PrototypeStatus.ENDED && !hideSessionMessages && (
          <Ended isTranscript={isTranscript} stepBack={stepBack} messages={messages} />
        )}

        <Loading isLoading={isLoading} avatarURL={avatarURL} />

        {buttons === ButtonsLayout.STACKED && <InlineInteractions {...interactionProps} />}
      </MessagesContainer>

      {buttons === ButtonsLayout.CAROUSEL && <StickyInteractions {...interactionProps} />}

      <span ref={bottomScrollRef} />
    </Container>
  );
};

export default PrototypeDialog;
