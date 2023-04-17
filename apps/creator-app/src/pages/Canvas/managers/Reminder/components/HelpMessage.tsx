import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Tooltip.Paragraph>
    Read more about reminders <Link href={Documentation.REMINDER_STEP}>here</Link>.
  </Tooltip.Paragraph>
);

export default HelpMessage;
