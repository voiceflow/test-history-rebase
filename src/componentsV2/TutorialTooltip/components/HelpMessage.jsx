import React from 'react';

import ChatWithUsLink from '@/componentsV2/ChatLink';
import { Paragraph } from '@/componentsV2/Tooltip';

export default function HelpMessage() {
  return (
    <Paragraph>
      Don't sweat it! <ChatWithUsLink>Start a live chat</ChatWithUsLink> with our team!
    </Paragraph>
  );
}
