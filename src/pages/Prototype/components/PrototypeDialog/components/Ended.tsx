import React from 'react';

import Box from '@/components/Box';
import Divider from '@/components/Divider';
import { Link } from '@/components/Text';
import { DOCS_LINK } from '@/constants';
import { Message, MessageType } from '@/pages/Prototype/types';

type PrototypeEndedProps = {
  messages: Message[];
};

const LearnMore = <Link href={`${DOCS_LINK}/#/platform/testing/testing.md?id=no-intent-or-reprompted-matched`}>Learn More</Link>;

const PrototypeEnded: React.FC<PrototypeEndedProps> = ({ messages }) => {
  const reason = React.useMemo(() => {
    // see if the last interaction is a user or bot
    const last = [...messages].reverse().find(({ type }) => [MessageType.SPEAK, MessageType.USER].includes(type));
    if (last?.type === MessageType.SPEAK) {
      return <>Reached last connected step. {LearnMore}</>;
    }
    if (last?.type === MessageType.USER) {
      return <>No Intent matched or reprompt found. {LearnMore}</>;
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

export default PrototypeEnded;
