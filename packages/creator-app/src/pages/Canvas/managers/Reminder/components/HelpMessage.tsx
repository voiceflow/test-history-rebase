import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Paragraph>
    Read more about reminders <Link href={Documentation.REMINDER_STEP}>here</Link>.
  </Paragraph>
);

export default HelpMessage;
