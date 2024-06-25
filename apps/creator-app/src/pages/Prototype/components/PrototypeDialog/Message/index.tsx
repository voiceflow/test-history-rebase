import type { Nullable } from '@voiceflow/common';
import React from 'react';

import type { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import type { Message, OnInteraction, PMStatus, UserMessage } from '@/pages/Prototype/types';
import { MessageType } from '@/pages/Prototype/types';

import BaseMessage from './Base';
import * as V from './variants';

export interface PrototypeDialogMessageProps {
  setFocusedTurnID: (turnID: string | null) => void;
  focusedTurnID: string | null;
  dialogTurnMap?: TurnMap;
  onPause?: VoidFunction;
  onContinue?: VoidFunction;
  onInteraction: OnInteraction;
  audio?: HTMLAudioElement;
  message: Message;
  hideSessionMessages?: boolean;
  isLast: boolean;
  isCurrent: boolean;
  isLastBubble: boolean;
  isLastInSeries: boolean;
  isFirstInSeries: boolean;
  isLastBotMessage: boolean;
  isIntentConfidence: boolean;
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
  isLast,
  isCurrent,
  isLastBubble,
  isLastInSeries,
  isFirstInSeries,
  isLastBotMessage,
  isIntentConfidence,
  setFocusedTurnID,
  focusedTurnID,
  dialogTurnMap,
  lastUserMessage,
  color,

  onPause,
  onContinue,
  onMessageDoubleClick,
  onInteraction,

  audio,
  pmStatus,
  avatarURL,
  isTranscript,
}) => {
  const userSpeak = message.type === MessageType.USER;

  const botMessageProps = {
    isLast,
    isLastBubble,
    onDoubleClick: onMessageDoubleClick ? () => onMessageDoubleClick(message) : undefined,
    isLastInSeries,
    isFirstInSeries,
    isLastBotMessage,
  };

  switch (message.type) {
    case MessageType.SESSION:
      return hideSessionMessages ? null : <V.Session {...message} />;
    case MessageType.AUDIO:
      return (
        <V.Audio
          userSpeak={userSpeak}
          {...botMessageProps}
          {...message}
          audio={audio}
          onPause={onPause}
          pmStatus={pmStatus}
          audioSrc={message.src ?? ''}
          onContinue={onContinue}
          isCurrent={isCurrent}
          avatarURL={avatarURL}
          allowPause={isTranscript}
          trackOnly={isLast}
        />
      );
    case MessageType.TEXT:
      return (
        <V.Text userSpeak={userSpeak} {...botMessageProps} {...message} pmStatus={pmStatus} avatarURL={avatarURL} />
      );
    case MessageType.SPEAK:
      return (
        <V.Speak
          {...botMessageProps}
          {...message}
          audio={audio}
          pmStatus={pmStatus}
          userSpeak={userSpeak}
          onPause={onPause}
          onContinue={onContinue}
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
          audio={audio}
          onPause={onPause}
          pmStatus={pmStatus}
          audioSrc={message.audio}
          trackOnly={isLast}
          isCurrent={isCurrent}
          avatarURL={avatarURL}
          onContinue={onContinue}
          allowPause={isTranscript}
        />
      );
    case MessageType.VISUAL:
      return (
        <V.Visual
          isTranscript={isTranscript}
          {...botMessageProps}
          pmStatus={pmStatus}
          visual={message}
          avatarURL={avatarURL}
        />
      );
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
    case MessageType.CARD:
      return (
        <V.CardV2
          {...botMessageProps}
          description={message.description}
          color={color}
          imageUrl={message.imageUrl}
          pmStatus={pmStatus}
          title={message.title}
          buttons={message.buttons}
          onInteraction={onInteraction}
          avatarURL={avatarURL}
        />
      );
    default:
      return null;
  }
};

export default PrototypeDialogMessage;
