import { Box, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

interface BillingSummaryProps {
  items: Array<{ description: React.ReactNode; value: string } | null>;
  header: { title: string; description: React.ReactNode; addon?: React.ReactNode };
  footer: { description: React.ReactNode; value: string };
}

const BillingSummary: React.FC<BillingSummaryProps> = ({ header, items, footer }) => (
  <>
    <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }}>
      <Box.FlexApart fullWidth>
        <Box.FlexAlignStart gap={4} column>
          <Text fontWeight={600}>{header.title}</Text>

          <Text fontSize="13px">{header.description}</Text>
        </Box.FlexAlignStart>

        {header.addon}
      </Box.FlexApart>
    </SectionV2.SimpleSection>

    {items.map(
      (item, index) =>
        item && (
          <React.Fragment key={index}>
            <SectionV2.Divider inset />

            <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
              <Box.FlexApart fullWidth>
                <SectionV2.Description>{item.description}</SectionV2.Description>

                <SectionV2.Description>{item.value}</SectionV2.Description>
              </Box.FlexApart>
            </SectionV2.SimpleSection>
          </React.Fragment>
        )
    )}

    {footer && (
      <>
        <SectionV2.Divider inset />

        <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 4 }}>
          <Box.FlexApart fontWeight={600} fullWidth>
            <span>{footer?.description}</span>

            <span>{footer?.value}</span>
          </Box.FlexApart>
        </SectionV2.SimpleSection>
      </>
    )}
  </>
);

export default BillingSummary;
