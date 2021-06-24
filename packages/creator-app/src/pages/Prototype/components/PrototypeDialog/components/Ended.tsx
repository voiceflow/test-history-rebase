import { Box, ClickableText, Link } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import { FeatureFlag } from '@/config/features';
import { DOCS_LINK } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { Message, MessageType } from '@/pages/Prototype/types';
import { ConnectedProps } from '@/types';

type PrototypeEndedProps = {
  messages: Message[];
  stepBack: () => void;
};

const LearnMore = <Link href={`${DOCS_LINK}/#/platform/testing/testing.md?id=no-intent-or-reprompted-matched`}>Learn More</Link>;

const PrototypeEnded: React.FC<ConnectedPrototypeEndedProps & PrototypeEndedProps> = ({ contextStep, messages, stepBack }) => {
  const testReports = useFeature(FeatureFlag.TEST_REPORTS);
  const goBackDisabled = contextStep <= 1;

  const Action = testReports.isEnabled ? (
    <ClickableText disabled={goBackDisabled} onClick={stepBack}>
      Try Again
    </ClickableText>
  ) : (
    LearnMore
  );

  const reason = React.useMemo(() => {
    // see if the last interaction is a user or bot
    const last = [...messages].reverse().find(({ type }) => [MessageType.SPEAK, MessageType.USER].includes(type));
    if (last?.type === MessageType.SPEAK) {
      return <>Reached last connected step. {Action}</>;
    }
    if (last?.type === MessageType.USER) {
      return <>No Intent matched or reprompt found. {Action}</>;
    }

    return null;
  }, [messages]);

  return (
    <>
      <Divider isLast={true}>Session ended</Divider>
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
