import React from 'react';

import { Paragraph } from '@/components/Tooltip';

const HELP_LINK = 'https://docs.voiceflow.com/#/alexa/card-block';

export default function HelpMessage() {
  return (
    <Paragraph>
      You can learn more about cards and how you can use them in your project{' '}
      <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
        here
      </a>
      .
    </Paragraph>
  );
}
