import { BaseButton } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { Divider } from '@voiceflow/ui';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import { Interaction, Message, MessageType, OnInteraction, PMStatus, UserMessage } from '@/pages/Prototype/types';

import Container from './Container';
import Ended from './Ended';
import useMessageFilters from './filters';
import { InlineInteractions, StickyInteractions } from './Interactions';
import PrototypeDialogMessage, { PrototypeDialogMessageProps } from './Message';
import BaseMessage from './Message/Base';
import Loading from './Message/variants/Loading';
import * as S from './styles';
import { checkIfFirstInGroup, checkIfLastBotMessage, checkIfLastBubble, checkIfLastInGroup } from './utils';

interface DialogPrototypeProps
  extends Pick<
    PrototypeDialogMessageProps,
    'audio' | 'setFocusedTurnID' | 'focusedTurnID' | 'dialogTurnMap' | 'onPause' | 'onContinue' | 'onMessageDoubleClick'
  > {
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

  messageFilter?: (messages: Message[]) => Message[];
  pmStatus: Nullable<PMStatus>;
}

const PrototypeDialog: React.FC<DialogPrototypeProps> = ({
  isPublic,
  bottomScrollRef,
  messages: rawMessages,

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
  messageFilter,
  pmStatus,

  ...messageProps
}) => {
  // filter out messages based on settings
  const messages = useMessageFilters(rawMessages, messageFilter);
  const interactionProps = { color, interactions, onInteraction };
  const hasManyMessages = messages?.length > 1;

  return (
    <Container onScroll={onScroll} isPublic={isPublic} showPadding={showPadding} isMobile={isMobile}>
      <S.MessagesContainer>
        {isTranscript && <Divider style={{ marginTop: '-30px' }}>Conversation Started</Divider>}

        {messages.map((message: Message, index) => {
          const previousMessage = messages[index - 1];
          const isFirstInSeries = checkIfFirstInGroup(previousMessage, message);
          const isLastInSeries = checkIfLastInGroup(index, messages);
          const isLastBotMessage = checkIfLastBotMessage(message, messages);
          const isLastBubble = checkIfLastBubble(message, messages);
          const isCurrent = message === messages[messages.length - 1];
          const isLast = index === messages.length - 1;
          const isIntentConfidence = message.type === MessageType.DEBUG && message.message.startsWith('matched intent');

          return (
            <PrototypeDialogMessage
              key={message.id}
              message={message}
              pmStatus={pmStatus}
              onInteraction={onInteraction}
              lastUserMessage={messages[index - 1] as UserMessage}
              hideSessionMessages={hideSessionMessages}
              color={color}
              isLast={isLast}
              isCurrent={isCurrent}
              isLastBubble={isLastBubble}
              isLastInSeries={isLastInSeries}
              isFirstInSeries={isFirstInSeries}
              isLastBotMessage={isLastBotMessage}
              isIntentConfidence={isIntentConfidence}
              isTranscript={isTranscript}
              hasManyMessages={hasManyMessages}
              avatarURL={avatarURL}
              {...messageProps}
            />
          );
        })}

        {status === PrototypeStatus.ENDED && !hideSessionMessages && <Ended isTranscript={isTranscript} stepBack={stepBack} />}

        <Loading isLoading={isLoading} avatarURL={avatarURL} pmStatus={pmStatus} animationContainer={BaseMessage.DelayedFadeUp} />

        {buttons === BaseButton.ButtonsLayout.STACKED && <InlineInteractions {...interactionProps} />}
      </S.MessagesContainer>

      {buttons === BaseButton.ButtonsLayout.CAROUSEL && <StickyInteractions {...interactionProps} />}

      <span ref={bottomScrollRef} />
    </Container>
  );
};

export default PrototypeDialog;
