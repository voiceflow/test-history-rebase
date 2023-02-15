import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpMessage: React.FC = () => (
  <Tooltip.Paragraph>
    You can learn more about cards and how you can use them in your assistant <Link href={Documentation.CARD_STEP}>here</Link>.
  </Tooltip.Paragraph>
);

export default HelpMessage;
