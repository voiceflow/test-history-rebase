import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

const ScopeTooltip = () => (
  <>
    <Paragraph marginBottomUnits={3}>
      OAuth Scopes allow your application to request access to specific functionality or data defined by the OAuth provider. Check the documentation
      for your particular OAuth provider to see which scopes are available.
    </Paragraph>

    <Title>Having Trouble?</Title>

    <Paragraph>
      Learn more about OAuth Scopes <Link href="https://oauth.net/2/scope/">here.</Link>
    </Paragraph>
  </>
);

export default ScopeTooltip;
