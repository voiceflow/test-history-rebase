import { BaseRequest, ButtonsLayout } from '@voiceflow/general-types';
import React from 'react';

import { PrototypeStatus } from '@/ducks/prototype';
import { useDebouncedCallback } from '@/hooks/callback';

import { Interaction, Message } from '../../types';
import Dialog from '../PrototypeDialog';
import { InnerChatContainer, OutterChatContainer } from './components';

export interface PrototypeChatDisplayProps {
  isPublic?: boolean;
  isLoading?: boolean;
  atTop?: boolean;
  messages: Message[];
  setAtTop?: (val: boolean) => void;
  onPlay: (src: string) => void;
  debug?: boolean;
  buttons?: ButtonsLayout;
  interactions: Interaction[];
  status: PrototypeStatus;
  hideSessionMessages?: boolean;
  showPadding?: boolean;
  isMobile?: boolean;
  color?: string;
  avatarURL?: string;
  onInteraction: (request: string | BaseRequest) => void;
  stepBack: () => void;
  autoScroll?: boolean;
  isTranscript?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
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
  onScroll,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const chatScrollRef = React.useRef<HTMLDivElement>(null);

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
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  return (
    <OutterChatContainer>
      <InnerChatContainer onScroll={onScrollHandler} ref={chatScrollRef} atTop={atTop}>
        <Dialog
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
        />
      </InnerChatContainer>
    </OutterChatContainer>
  );
};

export default PrototypeChatDisplay;
