import React from 'react';

import Anchor from '@/components/Text/Anchor';
import { Paragraph, Title } from '@/components/Tooltip';

function ScopeTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>
        OAuth Scopes allow your application to request access to specific functionality or data defined by the OAuth provider. Check the documentation
        for your particular OAuth provider to see which scopes are available.
      </Paragraph>

      <Title>Having Trouble?</Title>

      <Paragraph>
        Learn more about OAuth Scopes <Anchor link="https://oauth.net/2/scope/">here.</Anchor>
      </Paragraph>
    </>
  );
}

export default ScopeTooltip;
