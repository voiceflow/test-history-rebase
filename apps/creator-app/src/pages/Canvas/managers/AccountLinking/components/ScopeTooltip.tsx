import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

const ScopeTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      OAuth Scopes allow your application to request access to specific functionality or data defined by the OAuth
      provider. Check the documentation for your particular OAuth provider to see which scopes are available.
    </Tooltip.Paragraph>

    <Tooltip.Title>Having Trouble?</Tooltip.Title>

    <Tooltip.Paragraph>
      Learn more about OAuth Scopes <Link href="https://oauth.net/2/scope/">here.</Link>
    </Tooltip.Paragraph>
  </>
);

export default ScopeTooltip;
