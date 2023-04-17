import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      The display block allows you to create visuals on Alexa devices with screens using Alexa Presentation Language (APL).
    </Tooltip.Paragraph>

    <Tooltip.Title>Having Trouble?</Tooltip.Title>

    <Tooltip.Paragraph>
      Learn more about APL and multi-modal displays on Alexa <Link href={Documentation.DISPLAY_STEP}>here.</Link>
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
