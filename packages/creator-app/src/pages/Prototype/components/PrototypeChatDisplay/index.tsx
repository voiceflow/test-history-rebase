import { Button } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import React from 'react';

import { PrototypeStatus } from '@/ducks/prototype';
import { useDebouncedCallback } from '@/hooks/callback';
import type { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import { Interaction, Message, OnInteraction, PMStatus } from '@/pages/Prototype/types';

import Dialog from '../PrototypeDialog';
import { InnerChatContainer, OutterChatContainer } from './components';

export interface PrototypeChatDisplayProps {
  isPublic?: boolean;
  isLoading?: boolean;
  atTop?: boolean;
  messages: Message[];
  setAtTop?: (val: boolean) => void;
  onPlay?: (src: string) => void;
  debug?: boolean;
  buttons?: Button.ButtonsLayout;
  interactions: Interaction[];
  status: PrototypeStatus;
  hideSessionMessages?: boolean;
  showPadding?: boolean;
  isMobile?: boolean;
  color?: string;
  avatarURL?: string;
  onInteraction: OnInteraction;
  stepBack: () => void;
  autoScroll?: boolean;
  isTranscript?: boolean;
  dialogTurnMap?: TurnMap;
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  messageFilter?: (messages: Message[]) => Message[];
  pmStatus?: Nullable<PMStatus>;
  onMessageDoubleClick?: (message: Message) => void;
}

const PrototypeChatDisplay: React.FC<PrototypeChatDisplayProps> = ({
  atTop = true,
  setAtTop,
  isPublic,
  isLoading,
  messages = [],
  onPlay,
  interactions = [],
  status,
  hideSessionMessages,
  showPadding,
  isMobile,
  color,
  buttons,
  avatarURL,
  onInteraction,
  autoScroll = true,
  stepBack,
  isTranscript,
  dialogTurnMap,
  onScroll,
  pmStatus = null,
  messageFilter,
  onMessageDoubleClick,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const chatScrollRef = React.useRef<HTMLDivElement>(null);
  const [focusedTurnID, setFocusedTurnID] = React.useState<string | null>(null);
  const hasEnded = status === PrototypeStatus.ENDED;

  const onScrollHandler = useDebouncedCallback(
    30,
    () => {
      if (chatScrollRef?.current?.scrollTop === 0) {
        return setAtTop?.(true);
      }
      return setAtTop?.(false);
    },
    []
  );

  const scrollToBottom = () => {
    if (autoScroll) {
      scrollRef.current?.scrollIntoView();
    }
  };

  React.useLayoutEffect(() => {
    scrollToBottom();
  }, [messages.length, interactions]);

  React.useLayoutEffect(() => {
    if (hasEnded) {
      scrollToBottom();
    }
  }, [hasEnded]);

  React.useLayoutEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  return (
    <OutterChatContainer focusedTurnID={focusedTurnID}>
      <InnerChatContainer onScroll={onScrollHandler} ref={chatScrollRef} atTop={atTop}>
        <Dialog
          pmStatus={pmStatus}
          dialogTurnMap={dialogTurnMap}
          onScroll={onScroll}
          stepBack={stepBack}
          status={status}
          onPlay={onPlay}
          isPublic={isPublic}
          isMobile={isMobile}
          messages={messages}
          buttons={buttons}
          isLoading={isLoading}
          showPadding={showPadding}
          bottomScrollRef={scrollRef}
          hideSessionMessages={hideSessionMessages}
          interactions={interactions}
          color={color}
          avatarURL={avatarURL}
          onInteraction={onInteraction}
          isTranscript={isTranscript}
          setFocusedTurnID={setFocusedTurnID}
          focusedTurnID={focusedTurnID}
          messageFilter={messageFilter}
          onMessageDoubleClick={onMessageDoubleClick}
        />
      </InnerChatContainer>
    </OutterChatContainer>
  );
};

export default PrototypeChatDisplay;
