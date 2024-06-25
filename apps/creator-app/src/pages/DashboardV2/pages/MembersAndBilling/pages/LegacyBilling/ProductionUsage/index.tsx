import type { SubscriptionBillingPeriod } from '@voiceflow/realtime-sdk';
import { Box, Button, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { PRICE_PER_INTERACTION } from '@/constants';
import type { DBPaymentSource } from '@/models/Billing';
import * as currency from '@/utils/currency';

import CardDetails from '../CardDetails';

interface BillingProductionUsageProps {
  data: SubscriptionBillingPeriod;
  source: DBPaymentSource | null;
}

const BillingProductionUsage: React.FC<BillingProductionUsageProps> = ({ data, source }) => {
  const { quantity, amount } = data.items[0] ?? {};

  const pricePerInteraction = currency.formatUSD(PRICE_PER_INTERACTION);

  return (
    <Page.Section>
      <SectionV2.SimpleSection headerProps={{ bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart column gap={4}>
            <SectionV2.Title bold>Production Usage</SectionV2.Title>

            <SectionV2.Description>
              {pricePerInteraction} <SectionV2.Description secondary>per interaction, per month</SectionV2.Description>
            </SectionV2.Description>
          </Box.FlexAlignStart>

          {source ? (
            <CardDetails last4={source.last4} brand={source.brand} />
          ) : (
            <Button variant={Button.Variant.SECONDARY}>Add Card</Button>
          )}
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <SectionV2.Description>Interactions this billing cycle (5000 free)</SectionV2.Description>
        <SectionV2.Description>{quantity ?? 0}</SectionV2.Description>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <SectionV2.Description>Price per interaction</SectionV2.Description>
        <SectionV2.Description>{pricePerInteraction}</SectionV2.Description>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 3.5 }}>
        <SectionV2.Title bold>Total Next Billing Date </SectionV2.Title>
        <SectionV2.Title bold style={{ justifyContent: 'flex-end' }}>
          {currency.formatUSD(amount ?? 0)}
        </SectionV2.Title>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default BillingProductionUsage;
