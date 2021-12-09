import { BlockType } from '@voiceflow/realtime-sdk';
import { Box, ClickableText } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useEventualEngine, useSelector } from '@/hooks';
import { ConnectedProps } from '@/types';

interface PrototypeEndedProps {
  stepBack: () => void;
  isTranscript?: boolean;
}

const IntentTriggeringBlocks = [BlockType.CHOICE, BlockType.PROMPT, BlockType.CAPTURE];

const PrototypeEnded: React.FC<ConnectedPrototypeEndedProps & PrototypeEndedProps> = ({ contextStep, stepBack, isTranscript }) => {
  const goBackDisabled = contextStep <= 1;
  const getNodeByID = useSelector(Creator.nodeByIDSelector);
  const getEngine = useEventualEngine();

  const tryAgainElement = !goBackDisabled && (
    <ClickableText disabled={goBackDisabled} onClick={stepBack}>
      Try Again
    </ClickableText>
  );

  const reason = React.useMemo(() => {
    const engine = getEngine();
    const finalNodeID = engine?.prototype.finalNodeID;
    const finalNode = finalNodeID && getNodeByID(finalNodeID);
    const noIntentOrRepromptHit = !!finalNode && IntentTriggeringBlocks.includes(finalNode.type);

    if (finalNode && finalNode.type === BlockType.EXIT) {
      return 'Reached last connected Step';
    }

    if (noIntentOrRepromptHit) {
      return 'No intent matched or reprompt found.';
    }

    return 'Path not connected.';
  }, []);

  return (
    <>
      <Divider isLast={true}>{isTranscript ? 'Conversation Ended' : 'Session Ended'}</Divider>
      <Box textAlign="center" fontSize={13}>
        {reason} {tryAgainElement}
      </Box>
    </>
  );
};

const mapStateToProps = {
  contextStep: Prototype.prototypeContextStepSelector,
};

type ConnectedPrototypeEndedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PrototypeEnded) as React.FC<PrototypeEndedProps>;
