import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

export default function HelpMessage() {
  return (
    <Paragraph>
      Read more about reminders{' '}
      <a href={Documentation.REMINDER_STEP} rel="noopener noreferrer" target="_blank">
        here
      </a>
      .
    </Paragraph>
  );
}
