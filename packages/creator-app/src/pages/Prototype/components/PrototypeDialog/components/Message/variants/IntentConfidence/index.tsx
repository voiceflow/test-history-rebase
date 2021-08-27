import { Constants } from '@voiceflow/general-types';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect } from '@/hocs';
import { TurnMap } from '@/pages/Conversations/components/TranscriptDialog';
import { Message, MessageType, UserMessage } from '@/pages/Prototype/types';
import { ConnectedProps } from '@/types';

import { MessageProps } from '../../components/Message';
import { ConfidenceScore, Container, IntentText } from './components';
import NoIntent from './components/NoIntent';

type IntentConfidenceProps = Omit<MessageProps, 'iconProps'> & {
  message: string;
  intentConfidence?: number;
  lastUserMessage: UserMessage;
  turnID?: string;
  isTranscript?: boolean;
  setFocusedTurnID: (turnID: string | null) => void;
  focusedTurnID: string | null;
  dialogTurnMap?: TurnMap;
};

const INTENT_CONFIDENCE_THRESHOLD = 30;

const isRepromptMessage = (message: Message) => {
  return message.type === MessageType.PATH && message.path === 'reprompt';
};

export const IntentConfidence: React.FC<IntentConfidenceProps & ConnectedIntentConfidenceProps> = ({
  message,
  intentConfidence,
  lastUserMessage,
  turnID,
  isTranscript,
  setFocusedTurnID,
  focusedTurnID,
  dialogTurnMap,
}) => {
  const isReprompt = React.useMemo(() => turnID && dialogTurnMap?.get(turnID)?.some(isRepromptMessage), [dialogTurnMap, turnID]);

  const intentMessage = `${message.split('**')[1]} - `;
  const confidenceMessage = ` ${message.split('confidence interval')[1].split('_')[1]}`;

  const noMatch =
    isReprompt || lastUserMessage.intentName === Constants.IntentName.NONE || (intentConfidence && intentConfidence < INTENT_CONFIDENCE_THRESHOLD);

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
    <Container>
      <IntentText>{intentMessage}</IntentText>
      <ConfidenceScore>{confidenceMessage}</ConfidenceScore>
    </Container>
  );
};

const mapStateToProps = {
  getDiagram: Diagram.diagramByIDSelector,
};

type ConnectedIntentConfidenceProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(IntentConfidence) as React.FC<IntentConfidenceProps>;
