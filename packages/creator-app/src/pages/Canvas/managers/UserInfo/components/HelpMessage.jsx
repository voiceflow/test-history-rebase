import React from 'react';

import ChatWithUsLink from '@/components/ChatLink';
import { Paragraph } from '@/components/Tooltip';

export default function HelpMessage() {
  return (
    <Paragraph>
      We know… this is a tough one. <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
    </Paragraph>
  );
}
