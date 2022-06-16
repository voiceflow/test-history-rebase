import { BlockType } from '@voiceflow/realtime-sdk';
import { Box, ClickableText, Divider } from '@voiceflow/ui';
import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { useEventualEngine, useSelector } from '@/hooks';

const INTENT_TRIGGERING_BLOCKS = [BlockType.CHOICE, BlockType.PROMPT, BlockType.CAPTURE];

interface PrototypeEndedProps {
  stepBack: () => void;
  isTranscript?: boolean;
}

const PrototypeEnded: React.FC<PrototypeEndedProps> = ({ stepBack, isTranscript }) => {
  const contextStep = useSelector(Prototype.prototypeContextStepSelector);
  const getEngine = useEventualEngine();
  const goBackDisabled = contextStep <= 1;

  const tryAgainElement = !goBackDisabled && (
    <ClickableText disabled={goBackDisabled} onClick={stepBack}>
      Try Again
    </ClickableText>
  );

  const reason = React.useMemo(() => {
    const engine = getEngine();
    const finalNodeID = engine?.prototype.finalNodeID;

    if (engine?.isNodeOfType(finalNodeID, BlockType.EXIT)) {
      return 'Reached last connected Step';
    }

    if (engine?.isNodeOfType(finalNodeID, INTENT_TRIGGERING_BLOCKS)) {
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

export default PrototypeEnded;
