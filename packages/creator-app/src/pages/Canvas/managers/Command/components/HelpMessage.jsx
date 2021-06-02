import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

export default function HelpMessage() {
  return (
    <Paragraph>
      No worries. Check out this
      <a href={Documentation.COMMAND_STEP_VIDEO} target="_blank" rel="noopener noreferrer">
        video
      </a>{' '}
      on the Command block.
    </Paragraph>
  );
}
