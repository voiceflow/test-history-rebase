import React from 'react';

import { Link } from '@/components/Text';
import { Paragraph, Title } from '@/components/Tooltip';

function HelpTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>
        The display block allows you to create visuals on Alexa devices with screens using Alexa Presentation Language (APL).
      </Paragraph>

      <Title>Having Trouble?</Title>

      <Paragraph>
        Learn more about APL and multi-modal displays on Alexa{' '}
        <Link href="https://learn.voiceflow.com/en/articles/2632588-display-block-apl">here.</Link>
      </Paragraph>
    </>
  );
}

export default HelpTooltip;
