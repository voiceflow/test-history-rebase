import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Tooltip.Paragraph>
    Check out this <Link href={Documentation.SET_STEP}>doc</Link> that takes a deeper look at handling advanced logic inside Voiceflow.
  </Tooltip.Paragraph>
);

export default HelpMessage;
