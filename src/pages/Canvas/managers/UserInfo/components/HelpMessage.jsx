import React from 'react';

import ChatWithUsLink from '@/componentsV2/ChatLink';
import { Paragraph } from '@/componentsV2/Tooltip';

export default function HelpMessage() {
  return (
    <Paragraph>
      We know… this is a tough one. <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
    </Paragraph>
  );
}
