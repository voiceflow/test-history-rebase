import React from 'react';

import ClickableText from '@/componentsV2/Text/ClickableText';
import { Paragraph, Title } from '@/componentsV2/Tooltip';

function DomainTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>Domains that the authorization URL will fetch content from. You can provide up to 30 domains.</Paragraph>

      <Title>Having Trouble?</Title>

      <Paragraph>
        Learn more about Domains{' '}
        <ClickableText link="https://developer.amazon.com/en-US/docs/alexa/account-linking/requirements-account-linking.html#authorization-uri-requirements">
          here.
        </ClickableText>
      </Paragraph>
    </>
  );
}

export default DomainTooltip;
