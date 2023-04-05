import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import { Message, MessageType, UserMessage } from '@/pages/Prototype/types';

import type { BaseMessageProps } from '../../Base';
import NoIntent from './NoIntent';
import * as S from './styles';

interface IntentConfidenceProps extends Omit<BaseMessageProps, 'iconProps'> {
  turnID?: string;
  message: string;
  isTranscript?: boolean;
  focusedTurnID: string | null;
  dialogTurnMap?: TurnMap;
  lastUserMessage: UserMessage;
  setFocusedTurnID: (turnID: string | null) => void;
}

const INTENT_CONFIDENCE_THRESHOLD = 0.3;

const isRepromptMessage = (message: Message) => message.type === MessageType.PATH && message.path === 'reprompt';

export const IntentConfidence: React.FC<IntentConfidenceProps> = ({
  turnID,
  message,
  isTranscript,
  focusedTurnID,
  dialogTurnMap,
  lastUserMessage,
  setFocusedTurnID,
}) => {
  const isReprompt = React.useMemo(() => turnID && dialogTurnMap?.get(turnID)?.some(isRepromptMessage), [dialogTurnMap, turnID]);

  const { intentName, intentMessage, confidenceMessage } = React.useMemo(() => {
    const intentName = message.split('**')[1];
    const intentMessage = `${intentName} - `;
    const confidenceMessage = ` ${message.split('confidence interval')[1].split('_')[1]}`;

    return { intentName, intentMessage, confidenceMessage };
  }, [message]);

  const noMatch =
    isReprompt ||
    intentName === VoiceflowConstants.IntentName.NONE ||
    (lastUserMessage?.confidence && lastUserMessage.confidence < INTENT_CONFIDENCE_THRESHOLD);

  const onToggleIntentSelect = (opened: boolean) => {
    const anotherOpened = !opened && focusedTurnID !== null && turnID !== focusedTurnID;

    if (anotherOpened) return;

    setFocusedTurnID(opened && turnID ? turnID : null);
  };

  if (noMatch && isTranscript) {
    return (
      <NoIntent turnID={turnID!} focused={focusedTurnID === turnID} utterance={lastUserMessage.input} onToggleIntentSelect={onToggleIntentSelect} />
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
