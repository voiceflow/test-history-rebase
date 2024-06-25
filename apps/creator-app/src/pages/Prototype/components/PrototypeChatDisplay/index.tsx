import type { BaseButton } from '@voiceflow/base-types';
import type { Nullable } from '@voiceflow/common';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import { useRAF } from '@/hooks';
import type { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import type { Interaction, Message, OnInteraction, PMStatus } from '@/pages/Prototype/types';

import Dialog from '../PrototypeDialog';
import { InnerChatContainer, OutterChatContainer } from './components';

export interface PrototypeChatDisplayProps {
  audio?: HTMLAudioElement;
  isPublic?: boolean;
  isLoading?: boolean;
  atTop?: boolean;
  messages: Message[];
  setAtTop?: (val: boolean) => void;
  onPause?: VoidFunction;
  onContinue?: VoidFunction;
  debug?: boolean;
  buttons?: BaseButton.ButtonsLayout;
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
  messageFilter?: (messages: Message[]) => Message[];
  pmStatus?: Nullable<PMStatus>;
  onMessageDoubleClick?: (message: Message) => void;
}

const PrototypeChatDisplay: React.FC<PrototypeChatDisplayProps> = ({
  atTop = true,
  audio,
  setAtTop,
  isPublic,
  isLoading,
  messages = [],
  onPause,
  onContinue,
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
  pmStatus = null,
  messageFilter,
  onMessageDoubleClick,
}) => {
  const bottomScrollRef = React.useRef<HTMLDivElement>(null);
  const [focusedTurnID, setFocusedTurnID] = React.useState<string | null>(null);
  const [scheduler] = useRAF();

  const hasEnded = status === PrototypeStatus.ENDED;

  const onScrollHandler = React.useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { currentTarget } = event;

      scheduler(() => {
        if (currentTarget.scrollTop === 0) {
          return setAtTop?.(true);
        }

        return setAtTop?.(false);
      });
    },
    [setAtTop]
  );

  const scrollToBottom = () => {
    if (autoScroll) {
      bottomScrollRef.current?.scrollIntoView();
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
      <InnerChatContainer atTop={atTop}>
        <Dialog
          audio={audio}
          pmStatus={pmStatus}
          dialogTurnMap={dialogTurnMap}
          onScroll={onScrollHandler}
          stepBack={stepBack}
          status={status}
          onPause={onPause}
          onContinue={onContinue}
          isPublic={isPublic}
          isMobile={isMobile}
          messages={messages}
          buttons={buttons}
          isLoading={isLoading}
          showPadding={showPadding}
          bottomScrollRef={bottomScrollRef}
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
