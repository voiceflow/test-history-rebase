import React from 'react';

import { Paragraph } from '@/components/Tooltip';

export default function HelpMessage() {
  return (
    <Paragraph>
      No worries. Check out this {/* eslint-disable-next-line no-secrets/no-secrets */}
      <a href="https://www.youtube.com/watch?v=piU_PTL1wBQ&feature=emb_title" target="_blank" rel="noopener noreferrer">
        video
      </a>{' '}
      on the Command block.
    </Paragraph>
  );
}
