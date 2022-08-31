import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import { Message, MessageType, UserMessage } from '@/pages/Prototype/types';

import type { BaseMessageProps } from '../../Base';
import NoIntent from './NoIntent';
import * as S from './styles';

interface IntentConfidenceProps extends Omit<BaseMessageProps, 'iconProps'> {
  message: string;
  lastUserMessage: UserMessage;
  turnID?: string;
  isTranscript?: boolean;
  setFocusedTurnID: (turnID: string | null) => void;
  focusedTurnID: string | null;
  dialogTurnMap?: TurnMap;
}

const INTENT_CONFIDENCE_THRESHOLD = 0.3;

const isRepromptMessage = (message: Message) => {
  return message.type === MessageType.PATH && message.path === 'reprompt';
};

export const IntentConfidence: React.FC<IntentConfidenceProps> = ({
  message,
  lastUserMessage,
  turnID,
  isTranscript,
  setFocusedTurnID,
  focusedTurnID,
  dialogTurnMap,
}) => {
  const isReprompt = React.useMemo(() => turnID && dialogTurnMap?.get(turnID)?.some(isRepromptMessage), [dialogTurnMap, turnID]);
  const intentConfidence = lastUserMessage?.confidence;
  const intentName = message.split('**')[1];
  const intentMessage = `${intentName} - `;
  const confidenceMessage = ` ${message.split('confidence interval')[1].split('_')[1]}`;
  const noMatch =
    isReprompt || intentName === VoiceflowConstants.IntentName.NONE || (intentConfidence && intentConfidence < INTENT_CONFIDENCE_THRESHOLD);

  if (noMatch && isTranscript) {
    return (
      <NoIntent
        focused={focusedTurnID === turnID}
        setChildDropdownIsOpened={(opened) => {
          const anotherDropdownOpened = !opened && focusedTurnID !== null && turnID !== focusedTurnID;
          if (anotherDropdownOpened) {
            return;
          }
          setFocusedTurnID(opened && turnID ? turnID : null);
        }}
        turnID={turnID!}
        utterance={lastUserMessage.input}
      />
    );
  }

  return (
    <S.Container>
      <S.IntentText>{intentMessage}</S.IntentText>
      <S.ConfidenceScore>{confidenceMessage}</S.ConfidenceScore>
    </S.Container>
  );
};

export default IntentConfidence;
