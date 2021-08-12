import { IntentName } from '@voiceflow/general-types/build/constants/intent';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect } from '@/hocs';
import { UserMessage } from '@/pages/Prototype/types';
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
};

const INTENT_CONFIDENCE_THRESHOLD = 30;

export const IntentConfidence: React.FC<IntentConfidenceProps & ConnectedIntentConfidenceProps> = ({
  message,
  intentConfidence,
  lastUserMessage,
  turnID,
  isTranscript,
  setFocusedTurnID,
  focusedTurnID,
}) => {
  const intentMessage = `${message.split('**')[1]} - `;
  const confidenceMessage = ` ${message.split('confidence interval')[1].split('_')[1]}`;
  const noMatch = lastUserMessage.intentName === IntentName.NONE || (intentConfidence && intentConfidence < INTENT_CONFIDENCE_THRESHOLD);

  if (noMatch && isTranscript) {
    return (
      <NoIntent
        focused={focusedTurnID === turnID}
        setChildDropdownIsOpened={(val) => {
          setFocusedTurnID(val && turnID ? turnID : null);
        }}
        turnID={turnID!}
        utterance={lastUserMessage.input}
      />
    );
  }

  return (
    <Container>
      <IntentText>{intentMessage}</IntentText>
      <ConfidenceScore> {confidenceMessage}</ConfidenceScore>
    </Container>
  );
};

const mapStateToProps = {
  getDiagram: Diagram.diagramByIDSelector,
};

type ConnectedIntentConfidenceProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(IntentConfidence) as React.FC<IntentConfidenceProps>;
