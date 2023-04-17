import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Tooltip.Paragraph>
    Read more about about the stream step <Link href={Documentation.STREAM_STEP}>here</Link>.
  </Tooltip.Paragraph>
);

export default HelpMessage;
