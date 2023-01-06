import { Box, Button, Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

const PaymentDetails: React.OldFC = () => {
  const cardDetails = '... 8707, card expires 4 / 23';

  return (
    <Page.Section
      header={
        <Page.Section.Header>
          <Page.Section.Title>Payment Details</Page.Section.Title>

          <Page.Section.Description>
            All transactions are secure and encrypted by <Link>Stripe</Link>.
          </Page.Section.Description>
        </Page.Section.Header>
      }
    >
      <SectionV2.SimpleSection>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart flexDirection="column" gap={4}>
            <SectionV2.Title bold>Payment Method</SectionV2.Title>
            <SectionV2.Description secondary>{cardDetails}</SectionV2.Description>
          </Box.FlexAlignStart>

          <Button variant={Button.Variant.SECONDARY}>Edit Card</Button>
        </Box.FlexApart>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default PaymentDetails;
