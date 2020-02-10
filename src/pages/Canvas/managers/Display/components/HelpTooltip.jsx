import React from 'react';

import ClickableText from '@/componentsV2/Text/ClickableText';
import { Paragraph, Title } from '@/componentsV2/Tooltip';

function HelpTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>
        The display block allows you to create visuals on Alexa devices with screens using Alexa Presentation Language (APL).
      </Paragraph>

      <Title>Having Trouble?</Title>

      <Paragraph>
        Learn more about APL and multi-modal displays on Alexa{' '}
        <ClickableText link="https://learn.voiceflow.com/en/articles/2632588-display-block-apl">here.</ClickableText>
      </Paragraph>
    </>
  );
}

export default HelpTooltip;
