import React from 'react';

import ClickableText from '@/componentsV2/Text/ClickableText';
import { Paragraph, Title } from '@/componentsV2/Tooltip';

function ScopeTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>
        OAuth Scopes allow your application to request access to specific functionality or data defined by the OAuth provider. Check the documentation
        for your particular OAuth provider to see which scopes are available.
      </Paragraph>

      <Title>Having Trouble?</Title>

      <Paragraph>
        Learn more about OAuth Scopes <ClickableText link="https://oauth.net/2/scope/">here.</ClickableText>
      </Paragraph>
    </>
  );
}

export default ScopeTooltip;
