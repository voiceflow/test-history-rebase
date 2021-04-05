import React from 'react';

import { PrototypeStatus } from '@/ducks/prototype';
import { useDebouncedCallback } from '@/hooks/callback';

import { Interaction, Message } from '../../types';
import Dialog from '../PrototypeDialog';
import { InnerChatContainer, OutterChatContainer } from './components';

export type PrototypeChatDisplayProps = {
  isPublic?: boolean;
  isLoading?: boolean;
  atTop?: boolean;
  messages: Message[];
  setAtTop?: (val: boolean) => void;
  onPlay: (src: string) => void;
  debug?: boolean;
  interactions: Interaction[];
  status: PrototypeStatus;
  hideSessionMessages?: boolean;
  showPadding?: boolean;
  isMobile?: boolean;
  color?: string;
  avatarURL?: string;
};

const PrototypeChatDisplay: React.FC<PrototypeChatDisplayProps> = ({
  atTop = true,
  setAtTop,
  isPublic,
  isLoading,
  messages = [],
  onPlay,
  debug,
  interactions = [],
  status,
  children,
  hideSessionMessages,
  showPadding,
  isMobile,
  color,
  avatarURL,
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
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length, interactions]);

  React.useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  return (
    <OutterChatContainer>
      <InnerChatContainer onScroll={onScrollHandler} ref={chatScrollRef} atTop={atTop}>
        <Dialog
          debug={debug}
          status={status}
          onPlay={onPlay}
          isPublic={isPublic}
          isMobile={isMobile}
          messages={messages}
          isLoading={isLoading}
          showPadding={showPadding}
          bottomScrollRef={scrollRef}
          hideSessionMessages={hideSessionMessages}
          withInteractions={!!interactions.length}
          color={color}
          avatarURL={avatarURL}
        />
        {children}
      </InnerChatContainer>
    </OutterChatContainer>
  );
};

export default PrototypeChatDisplay;
