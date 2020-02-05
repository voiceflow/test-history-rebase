import React from 'react';

import { Paragraph } from '@/componentsV2/Tooltip';

import { HELP_LINK } from '../constants';

export default function HelpMessage() {
  return (
    <Paragraph>
      Read more about about the stream step{' '}
      <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
        here
      </a>
      .
    </Paragraph>
  );
}
