import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';
import * as Documentation from '@/config/documentation';

const HelpTooltip: React.FC = () => (
  <>
    <Paragraph marginBottomUnits={3}>
      The display block allows you to create visuals on Alexa devices with screens using Alexa Presentation Language (APL).
    </Paragraph>

    <Title>Having Trouble?</Title>

    <Paragraph>
      Learn more about APL and multi-modal displays on Alexa <Link href={Documentation.DISPLAY_STEP}>here.</Link>
    </Paragraph>
  </>
);

export default HelpTooltip;
