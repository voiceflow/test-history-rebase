import React from 'react';

import ChatWithUsLink from '@/componentsV2/ChatLink';
import { Paragraph } from '@/componentsV2/Tooltip';

export default function HelpMessage() {
  return (
    <Paragraph>
      No problemo! <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
    </Paragraph>
  );
}
