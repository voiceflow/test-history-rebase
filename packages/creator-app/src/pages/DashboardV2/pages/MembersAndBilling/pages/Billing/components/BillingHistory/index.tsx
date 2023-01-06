import { Box, Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

import * as S from './styles';

const BillingHistory: React.OldFC = () => {
  const billingInfo = [
    '10 Nov 22',
    '10 Oct 22',
    '10 Sept 22',
    '10 Aug 22',
    '10 Jul 22',
    '10 Nov 22',
    '10 Oct 22',
    '10 Sept 22',
    '10 Aug 22',
    '10 Jul 22',
    '10 Nov 22',
    '10 Oct 22',
    '10 Sept 22',
    '10 Aug 22',
    '10 Jul 22',
  ];

  const [numBillsShown, setNumBillsShown] = React.useState<number>(Math.min(10, billingInfo.length));
  const showViewMore = billingInfo.length > numBillsShown;

  return (
    <Page.Section
      mb={48}
      header={
        <Page.Section.Header>
          <Page.Section.Title>Billing History</Page.Section.Title>

          <Page.Section.Description>
            View all previous invoices here. If you've just made a payment, it may take a few hours to appear below.
          </Page.Section.Description>
        </Page.Section.Header>
      }
    >
      {billingInfo.slice(0, numBillsShown).map((billingItem, index) => (
        <React.Fragment key={billingItem}>
          {index !== 0 && <SectionV2.Divider />}

          <SectionV2.SimpleSection>
            <Box.FlexApart height={20} fullWidth>
              {billingItem}
              <Link color="#3D82E2">View Invoice</Link>
            </Box.FlexApart>
          </SectionV2.SimpleSection>
        </React.Fragment>
      ))}

      {showViewMore && (
        <S.LoadMoreButton onClick={() => setNumBillsShown(Math.min(numBillsShown + 10, billingInfo.length))}>View More</S.LoadMoreButton>
      )}
    </Page.Section>
  );
};

export default BillingHistory;
