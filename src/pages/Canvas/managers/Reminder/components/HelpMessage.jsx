import React from 'react';

import ChatWithUsLink from '@/componentsV2/ChatLink';
import { Paragraph } from '@/componentsV2/Tooltip';

import { HELP_LINK } from '../constants';

export default function HelpMessage() {
  return (
    <Paragraph>
      Read more about reminders{' '}
      <a href={HELP_LINK} rel="noopener noreferrer" target="_blank">
        here
      </a>
      . Or, start a <ChatWithUsLink>chat</ChatWithUsLink> with someone from the Voiceflow team!
    </Paragraph>
  );
}
