import React from 'react';

import ChatWithUsLink from '@/components/ChatLink';
import { Paragraph } from '@/components/Tooltip';

export default function HelpMessage() {
  return (
    <Paragraph>
      Don't sweat it! <ChatWithUsLink>Start a live chat</ChatWithUsLink> with our team!
    </Paragraph>
  );
}
