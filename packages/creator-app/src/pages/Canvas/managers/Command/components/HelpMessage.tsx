import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Paragraph>
    No worries. Check out this <Link href={Documentation.COMMAND_STEP_VIDEO}>video</Link> on the Command block.
  </Paragraph>
);

export default HelpMessage;
