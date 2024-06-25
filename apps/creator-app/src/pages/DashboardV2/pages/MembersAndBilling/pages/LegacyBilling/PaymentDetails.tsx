import { Box, Button, Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as ModalsV2 from '@/ModalsV2';
import type { DBPaymentSource } from '@/models/Billing';

interface PaymentDetailsProps {
  source: DBPaymentSource | null;
  refetch: VoidFunction;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ source, refetch }) => {
  const addCardModal = ModalsV2.useModal(ModalsV2.Legacy.Billing.AddCard);

  const cardExpires = source?.expiration ? `, card expires ${source.expiration}` : '';
  const cardDetails = source ? `...${source.last4}${cardExpires}` : '...';

  const onClickAddCard = async () => {
    await addCardModal.openVoid({ update: !!source });
    refetch();
  };

  if (!source) return null;

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

          <Button variant={Button.Variant.SECONDARY} onClick={onClickAddCard}>
            Edit Card
          </Button>
        </Box.FlexApart>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default PaymentDetails;
