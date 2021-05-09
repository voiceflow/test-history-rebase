import React from 'react';

import ChatWithUsLink from '@/components/ChatLink';
import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

export default function HelpMessage() {
  return (
    <Paragraph>
      Read more about reminders{' '}
      <a href={Documentation.REMINDER_STEP} rel="noopener noreferrer" target="_blank">
        here
      </a>
      . Or, start a <ChatWithUsLink>chat</ChatWithUsLink> with someone from the Voiceflow team!
    </Paragraph>
  );
}
