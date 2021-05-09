import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

export default function HelpMessage() {
  return (
    <Paragraph>
      Check out this{' '}
      <a href={Documentation.SET_STEP} target="_blank" rel="noopener noreferrer">
        doc
      </a>{' '}
      that takes a deeper look at handling advanced logic inside Voiceflow.
    </Paragraph>
  );
}
