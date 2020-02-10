import React from 'react';

import { Paragraph } from '@/components/Tooltip';

const HELP_LINK = 'https://developer.amazon.com/en-US/docs/alexa/custom-skills/include-a-card-in-your-skills-response.html';

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
