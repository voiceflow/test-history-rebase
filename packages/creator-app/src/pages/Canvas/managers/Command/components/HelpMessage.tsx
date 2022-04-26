import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Tooltip.Paragraph>
    No worries. Check out this <Link href={Documentation.COMMAND_STEP_VIDEO}>video</Link> on the Command block.
  </Tooltip.Paragraph>
);

export default HelpMessage;
