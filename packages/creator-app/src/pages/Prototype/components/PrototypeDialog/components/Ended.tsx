import { Box, ClickableText } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { Message, MessageType } from '@/pages/Prototype/types';
import { ConnectedProps } from '@/types';

interface PrototypeEndedProps {
  messages: Message[];
  stepBack: () => void;
  isTranscript?: boolean;
}

const PrototypeEnded: React.FC<ConnectedPrototypeEndedProps & PrototypeEndedProps> = ({ contextStep, messages, stepBack, isTranscript }) => {
  const goBackDisabled = contextStep <= 1;

  const Action = (
    <ClickableText disabled={goBackDisabled} onClick={stepBack}>
      Try Again
    </ClickableText>
  );

  const reason = React.useMemo(() => {
    // see if the last interaction is a user or bot
    const last = [...messages].reverse().find(({ type }) => [MessageType.SPEAK, MessageType.USER].includes(type));
    if (!isTranscript) {
      if (last?.type === MessageType.SPEAK) {
        return <>Reached last connected step. {Action}</>;
      }
      if (last?.type === MessageType.USER) {
        return <>No Intent matched or reprompt found. {Action}</>;
      }
    }

    return null;
  }, [messages]);

  return (
    <>
      <Divider isLast={true}>{isTranscript ? 'Conversation Ended' : 'Session Ended'}</Divider>
      <Box textAlign="center" fontSize={13}>
        {reason}
      </Box>
    </>
  );
};

const mapStateToProps = {
  contextStep: Prototype.prototypeContextStepSelector,
};

type ConnectedPrototypeEndedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PrototypeEnded) as React.FC<PrototypeEndedProps>;
