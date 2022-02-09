import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Paragraph>
    Read more about about the stream step{' '}
    <a href={Documentation.STREAM_STEP} target="_blank" rel="noopener noreferrer">
      here
    </a>
    .
  </Paragraph>
);

export default HelpMessage;
