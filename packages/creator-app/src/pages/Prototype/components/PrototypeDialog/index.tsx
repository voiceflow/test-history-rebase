import { BaseButton } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { Divider } from '@voiceflow/ui';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import type { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import {
  DelayedMessageFadeUpContainer,
  MessageFadeDownContainer,
  MessageFadeUpContainer,
} from '@/pages/Prototype/components/PrototypeDialog/components/Message/components/Message/components';
import { Interaction, Message, MessageType, OnInteraction, PMStatus, UserMessage } from '@/pages/Prototype/types';

import { Container, Ended, InlineInteractions, MessagesContainer, StickyInteractions } from './components';
import { Audio, Carousel, Debug, IntentConfidence, Loading, Speak, Text, User, Visual } from './components/Message';
import useMessageFilters from './filters';
import { checkIfFirstInGroup, checkIfLastBotMessage, checkIfLastBubble, checkIfLastInGroup } from './utils';

interface DialogPrototypeProps {
  onPlay?: (src: string) => void;
  status: PrototypeStatus;
  messages: Message[];
  isPublic?: boolean;
  isLoading?: boolean;
  bottomScrollRef: React.Ref<HTMLElement>;
  hideSessionMessages?: boolean;
  isMobile?: boolean;
  showPadding?: boolean;
  color?: string;
  buttons?: BaseButton.ButtonsLayout;
  avatarURL?: string;
  interactions: Interaction[];
  onInteraction: OnInteraction;
  stepBack: () => void;
  isTranscript?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  setFocusedTurnID: (turnID: string | null) => void;
  focusedTurnID: string | null;
  dialogTurnMap?: TurnMap;
  messageFilter?: (messages: Message[]) => Message[];
  pmStatus: Nullable<PMStatus>;
  onMessageDoubleClick?: (message: Message) => void;
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
  buttons = BaseButton.ButtonsLayout.STACKED,
  avatarURL,
  onInteraction,
  stepBack,
  isTranscript = false,
  onScroll,
  setFocusedTurnID,
  focusedTurnID,
  dialogTurnMap,
  messageFilter,
  pmStatus,
  onMessageDoubleClick,
}) => {
  // filter out messages based on settings
  const messages = useMessageFilters(rawMessages, messageFilter);
  const interactionProps = { color, interactions, onInteraction };
  return (
    <Container onScroll={onScroll} isPublic={isPublic} showPadding={showPadding} isMobile={isMobile}>
      <MessagesContainer>
        {isTranscript && <Divider style={{ marginTop: '-30px' }}>Conversation Started</Divider>}

        {messages.map((message: Message, index) => {
          const previousMessage = messages[index - 1];
          const userSpeak = message.type === MessageType.USER;

          const isFirstInSeries = checkIfFirstInGroup(previousMessage, message);
          const isLastInSeries = checkIfLastInGroup(index, messages);
          const isLastBotMessage = checkIfLastBotMessage(message, messages);
          const isLastBubble = checkIfLastBubble(message, messages);
          const isCurrent = message === messages[messages.length - 1];
          const isLast = index === messages.length - 1;
          const isIntentConfidence = message.type === MessageType.DEBUG && message.message.startsWith('matched intent');

          const botMessageProps = {
            isFirstInSeries,
            isLastInSeries,
            isLastBotMessage,
            isLoading,
            isLast,
            isLastBubble,
            onDoubleClick: onMessageDoubleClick ? () => onMessageDoubleClick(message) : undefined,
          };

          const commonProps = {
            key: message.id,
            pmStatus,
          };

          switch (message.type) {
            case MessageType.SESSION:
              return hideSessionMessages ? null : (
                <Divider {...commonProps} isLast={isLast && messages.length > 1}>
                  {message.message}
                </Divider>
              );
            case MessageType.AUDIO:
              return (
                <Audio
                  userSpeak={userSpeak}
                  {...botMessageProps}
                  {...commonProps}
                  {...message}
                  audioSrc={message.src ?? ''}
                  onPlay={() => onPlay?.(message.src ?? '')}
                  isCurrent={isCurrent}
                  avatarURL={avatarURL}
                  allowPause={isTranscript}
                  autoplay={!isTranscript}
                />
              );
            case MessageType.TEXT:
              return <Text userSpeak={userSpeak} {...botMessageProps} {...commonProps} {...message} avatarURL={avatarURL} isLoading={isLoading} />;
            case MessageType.SPEAK:
              return (
                <Speak
                  {...botMessageProps}
                  {...commonProps}
                  userSpeak={userSpeak}
                  {...message}
                  onClick={() => onPlay?.(message.src ?? '')}
                  isLast={isLast}
                  avatarURL={avatarURL}
                />
              );
            case MessageType.DEBUG:
              return isIntentConfidence ? (
                <IntentConfidence
                  dialogTurnMap={dialogTurnMap}
                  setFocusedTurnID={setFocusedTurnID}
                  focusedTurnID={focusedTurnID}
                  isTranscript={isTranscript}
                  lastUserMessage={messages[index - 1] as UserMessage}
                  {...commonProps}
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
                  {...commonProps}
                  color={color}
                  animationContainer={isTranscript ? MessageFadeUpContainer : MessageFadeDownContainer}
                  {...message}
                />
              );
            case MessageType.STREAM:
              return (
                <Audio
                  userSpeak={userSpeak}
                  name=""
                  {...botMessageProps}
                  {...commonProps}
                  {...message}
                  audioSrc={message.audio}
                  onPlay={() => onPlay?.(message.audio)}
                  isCurrent={isCurrent}
                  avatarURL={avatarURL}
                  allowPause={isTranscript}
                  autoplay={!isTranscript}
                />
              );
            case MessageType.VISUAL:
              return <Visual isTranscript={isTranscript} {...botMessageProps} {...commonProps} visual={message} avatarURL={avatarURL} />;
            case MessageType.CAROUSEL:
              return <Carousel {...botMessageProps} {...commonProps} cards={message.cards} onInteraction={interactionProps.onInteraction} />;
            default:
              return null;
          }
        })}

        {status === PrototypeStatus.ENDED && !hideSessionMessages && <Ended isTranscript={isTranscript} stepBack={stepBack} />}

        <Loading isLoading={isLoading} avatarURL={avatarURL} pmStatus={pmStatus} animationContainer={DelayedMessageFadeUpContainer} />

        {buttons === BaseButton.ButtonsLayout.STACKED && <InlineInteractions {...interactionProps} />}
      </MessagesContainer>

      {buttons === BaseButton.ButtonsLayout.CAROUSEL && <StickyInteractions {...interactionProps} />}

      <span ref={bottomScrollRef} />
    </Container>
  );
};

export default PrototypeDialog;
