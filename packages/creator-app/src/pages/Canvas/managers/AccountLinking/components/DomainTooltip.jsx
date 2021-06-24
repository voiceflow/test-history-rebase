import { Link } from '@voiceflow/ui';
import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

const DomainTooltip = () => (
  <>
    <Paragraph marginBottomUnits={3}>Domains that the authorization URL will fetch content from. You can provide up to 30 domains.</Paragraph>

    <Title>Having Trouble?</Title>

    <Paragraph>
      Learn more about Domains{' '}
      <Link href="https://developer.amazon.com/en-US/docs/alexa/account-linking/requirements-account-linking.html#authorization-uri-requirements">
        here.
      </Link>
    </Paragraph>
  </>
);

export default DomainTooltip;
