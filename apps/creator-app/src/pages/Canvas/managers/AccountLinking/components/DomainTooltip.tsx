import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

const DomainTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      Domains that the authorization URL will fetch content from. You can provide up to 30 domains.
    </Tooltip.Paragraph>

    <Tooltip.Title>Having Trouble?</Tooltip.Title>

    <Tooltip.Paragraph>
      Learn more about Domains{' '}
      <Link href="https://developer.amazon.com/en-US/docs/alexa/account-linking/requirements-account-linking.html#authorization-uri-requirements">
        here.
      </Link>
    </Tooltip.Paragraph>
  </>
);

export default DomainTooltip;
