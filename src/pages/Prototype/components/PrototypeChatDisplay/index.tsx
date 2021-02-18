import React from 'react';

import { PrototypeStatus } from '@/ducks/prototype';
import { useDebouncedCallback } from '@/hooks/callback';
import { TAudio } from '@/pages/Prototype/PrototypeTool/Audio';

import { Interaction, Message } from '../../types';
import Dialog from '../PrototypeDialog';
import { InnerChatContainer, OutterChatContainer } from './components';

export type PrototypeChatDisplayProps = {
  isPublic?: boolean;
  isLoading?: boolean;
  atTop?: boolean;
  messages: Message[];
  onInteraction: (input: string) => void;
  setAtTop?: (val: boolean) => void;
  onPlay: (src: string) => void;
  debug?: boolean;
  audioInstance: TAudio | null;
  interactions: Interaction[];
  status: PrototypeStatus;
};

const PrototypeChatDisplay: React.FC<PrototypeChatDisplayProps> = ({
  atTop = true,
  setAtTop,
  isPublic,
  isLoading,
  messages = [],
  onInteraction,
  onPlay,
  debug,
  audioInstance,
  interactions = [],
  status,
  children,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const chatScrollRef = React.useRef<HTMLDivElement>(null);
  const [updatedAudioInstance, setUpdatedAudioInstance] = React.useState<TAudio | null>(audioInstance);
  const [forceAudioUpdate, setForceAutoUpdate] = React.useState(0);

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

  React.useEffect(() => {
    setUpdatedAudioInstance(audioInstance);
  }, [messages, audioInstance, forceAudioUpdate]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length, interactions]);

  return (
    <OutterChatContainer>
      <InnerChatContainer onScroll={onScrollHandler} ref={chatScrollRef} atTop={atTop}>
        <Dialog
          isPublic={isPublic}
          isLoading={isLoading}
          messages={messages}
          onInteraction={onInteraction}
          onPlay={onPlay}
          debug={debug}
          audioInstance={updatedAudioInstance}
          setForceAutoUpdate={setForceAutoUpdate}
          bottomScrollRef={scrollRef}
          status={status}
        />
        {children}
      </InnerChatContainer>
    </OutterChatContainer>
  );
};

export default PrototypeChatDisplay;
