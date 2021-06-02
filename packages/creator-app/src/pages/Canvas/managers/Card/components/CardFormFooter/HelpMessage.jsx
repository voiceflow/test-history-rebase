import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

export default function HelpMessage() {
  return (
    <Paragraph>
      You can learn more about cards and how you can use them in your project{' '}
      <a href={Documentation.CARD_STEP} target="_blank" rel="noopener noreferrer">
        here
      </a>
      .
    </Paragraph>
  );
}
