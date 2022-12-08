import { Box, Button, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

import CardDetails from './CardDetails';

const ProductionUsage: React.FC = () => {
  const pricePerInteraction = '$0.02';
  const interactionsThisCycle = '24,583';
  const totalThisCycle = '$390.76';
  const cardDetails = '8707';

  return (
    <Page.Section>
      <SectionV2.SimpleSection headerProps={{ bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart column gap={4}>
            <SectionV2.Title bold noMargin>
              Production Usage
            </SectionV2.Title>

            <SectionV2.Description>
              {pricePerInteraction} <SectionV2.Description secondary>per interaction, per month</SectionV2.Description>
            </SectionV2.Description>
          </Box.FlexAlignStart>

          {cardDetails ? <CardDetails>{cardDetails}</CardDetails> : <Button variant={Button.Variant.SECONDARY}>Add Card</Button>}
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <SectionV2.Description>Interactions this billing cycle (5000 free)</SectionV2.Description>
        <SectionV2.Description>{interactionsThisCycle}</SectionV2.Description>
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
          {totalThisCycle}
        </SectionV2.Title>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default ProductionUsage;
