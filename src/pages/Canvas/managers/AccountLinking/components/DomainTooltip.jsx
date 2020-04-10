import React from 'react';

import Anchor from '@/components/Text/Anchor';
import { Paragraph, Title } from '@/components/Tooltip';

function DomainTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>Domains that the authorization URL will fetch content from. You can provide up to 30 domains.</Paragraph>

      <Title>Having Trouble?</Title>

      <Paragraph>
        Learn more about Domains{' '}
        <Anchor link="https://developer.amazon.com/en-US/docs/alexa/account-linking/requirements-account-linking.html#authorization-uri-requirements">
          here.
        </Anchor>
      </Paragraph>
    </>
  );
}

export default DomainTooltip;
