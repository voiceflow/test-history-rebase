import { SubscriptionPaymentMethod } from '@voiceflow/dtos';
import { Box, Button, Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as ModalsV2 from '@/ModalsV2';

interface PaymentDetailsProps {
  paymentMethod?: SubscriptionPaymentMethod;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ paymentMethod }) => {
  const addCardModal = ModalsV2.useModal(ModalsV2.Billing.AddCard);

  const card = paymentMethod?.card;
  const cardExpires = card?.expiryMonth && card.expiryYear ? `, card expires ${card.expiryMonth}/${card.expiryYear}` : '';
  const cardDetails = card ? `...${card.last4}${cardExpires}` : '...';

  const onClickAddCard = async () => {
    await addCardModal.openVoid({ isUpdate: !!paymentMethod });
  };

  if (!paymentMethod) return null;

  return (
    <Page.Section
      header={
        <Page.Section.Header>
          <Page.Section.Title>Payment Details</Page.Section.Title>

          <Page.Section.Description>
            All transactions are secure and encrypted by <Link href="https://www.chargebee.com/">Chargebee</Link>.
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
