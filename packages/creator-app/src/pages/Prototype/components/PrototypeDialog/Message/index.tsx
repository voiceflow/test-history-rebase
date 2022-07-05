import { Nullable } from '@voiceflow/common';
import { Divider } from '@voiceflow/ui';
import React from 'react';

import type { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import { Message, MessageType, OnInteraction, PMStatus, UserMessage } from '@/pages/Prototype/types';

import BaseMessage from './Base';
import * as V from './variants';

export interface PrototypeDialogMessageProps {
  setFocusedTurnID: (turnID: string | null) => void;
  focusedTurnID: string | null;
  dialogTurnMap?: TurnMap;
  onPlay?: (src: string) => void;
  onInteraction: OnInteraction;

  message: Message;
  hideSessionMessages?: boolean;
  isLoading?: boolean;
  isLast: boolean;
  isCurrent: boolean;
  isLastBubble: boolean;
  isLastInSeries: boolean;
  isFirstInSeries: boolean;
  isLastBotMessage: boolean;
  isIntentConfidence: boolean;
  hasManyMessages: boolean;
  avatarURL?: string;
  isTranscript?: boolean;
  color?: string;

  lastUserMessage: UserMessage;

  onMessageDoubleClick?: (message: Message) => void;

  pmStatus: Nullable<PMStatus>;
}

const PrototypeDialogMessage: React.FC<PrototypeDialogMessageProps> = ({
  message,
  hideSessionMessages,
  isLoading,
  isLast,
  isCurrent,
  isLastBubble,
  isLastInSeries,
  isFirstInSeries,
  isLastBotMessage,
  isIntentConfidence,
  hasManyMessages,
  setFocusedTurnID,
  focusedTurnID,
  dialogTurnMap,
  lastUserMessage,
  color,

  onPlay,
  onMessageDoubleClick,
  onInteraction,

  pmStatus,

  avatarURL,
  isTranscript,
}) => {
  const userSpeak = message.type === MessageType.USER;

  const botMessageProps = {
    isFirstInSeries,
    isLastInSeries,
    isLastBotMessage,
    isLoading,
    isLast,
    isLastBubble,
    onDoubleClick: onMessageDoubleClick ? () => onMessageDoubleClick(message) : undefined,
  };

  switch (message.type) {
    case MessageType.SESSION:
      return hideSessionMessages ? null : <Divider isLast={isLast && hasManyMessages}>{message.message}</Divider>;
    case MessageType.AUDIO:
      return (
        <V.Audio
          userSpeak={userSpeak}
          {...botMessageProps}
          {...message}
          pmStatus={pmStatus}
          audioSrc={message.src ?? ''}
          onPlay={() => onPlay?.(message.src ?? '')}
          isCurrent={isCurrent}
          avatarURL={avatarURL}
          allowPause={isTranscript}
          autoplay={!isTranscript}
        />
      );
    case MessageType.TEXT:
      return <V.Text userSpeak={userSpeak} {...botMessageProps} {...message} pmStatus={pmStatus} avatarURL={avatarURL} isLoading={isLoading} />;
    case MessageType.SPEAK:
      return (
        <V.Speak
          {...botMessageProps}
          {...message}
          pmStatus={pmStatus}
          userSpeak={userSpeak}
          onClick={() => onPlay?.(message.src ?? '')}
          isLast={isLast}
          avatarURL={avatarURL}
        />
      );
    case MessageType.DEBUG:
      return isIntentConfidence ? (
        <V.IntentConfidence
          dialogTurnMap={dialogTurnMap}
          setFocusedTurnID={setFocusedTurnID}
          focusedTurnID={focusedTurnID}
          isTranscript={isTranscript}
          lastUserMessage={lastUserMessage}
          pmStatus={pmStatus}
          {...message}
        />
      ) : (
        <V.Debug key={message.id} {...message} pmStatus={pmStatus} />
      );
    case MessageType.USER:
      return (
        <V.User
          turnID={message.turnID}
          focusedTurnID={focusedTurnID}
          isFirstInSeries={isFirstInSeries}
          userSpeak={userSpeak}
          pmStatus={pmStatus}
          color={color}
          animationContainer={isTranscript ? BaseMessage.FadeUp : BaseMessage.FadeDown}
          {...message}
        />
      );
    case MessageType.STREAM:
      return (
        <V.Audio
          userSpeak={userSpeak}
          name=""
          {...botMessageProps}
          {...message}
          pmStatus={pmStatus}
          audioSrc={message.audio}
          onPlay={() => onPlay?.(message.audio)}
          isCurrent={isCurrent}
          avatarURL={avatarURL}
          allowPause={isTranscript}
          autoplay={!isTranscript}
        />
      );
    case MessageType.VISUAL:
      return <V.Visual isTranscript={isTranscript} {...botMessageProps} pmStatus={pmStatus} visual={message} avatarURL={avatarURL} />;
    case MessageType.CAROUSEL:
      return (
        <V.Carousel
          {...botMessageProps}
          color={color}
          pmStatus={pmStatus}
          cards={message.cards}
          onInteraction={onInteraction}
          layout={message.layout}
          avatarURL={avatarURL}
        />
      );
    default:
      return null;
  }
};

export default PrototypeDialogMessage;
