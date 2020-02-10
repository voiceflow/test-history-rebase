import React from 'react';

import { Paragraph } from '@/componentsV2/Tooltip';

import { HELP_LINK } from '../constants';

export default function HelpMessage() {
  return (
    <Paragraph>
      Check out this{' '}
      <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
        doc
      </a>{' '}
      that takes a deeper look at handling advanced logic inside Voiceflow.
    </Paragraph>
  );
}
