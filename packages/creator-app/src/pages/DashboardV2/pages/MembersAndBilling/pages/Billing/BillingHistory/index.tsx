import { Box, Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Billing } from '@/models';

import * as S from './styles';

interface BillingHistoryProps {
  billingHistory: Billing.InvoiceList;
  loadMore: VoidFunction;
  loading: boolean;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ billingHistory, loadMore, loading }) => {
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
      {billingHistory?.data.map((invoice, index) => (
        <React.Fragment key={invoice.id}>
          {index !== 0 && <SectionV2.Divider />}

          <SectionV2.SimpleSection>
            <Box.FlexApart height={20} fullWidth>
              {invoice.date}
              <Link color="#3D82E2" href={invoice.pdf} target="_blank">
                View Invoice
              </Link>
            </Box.FlexApart>
          </SectionV2.SimpleSection>
        </React.Fragment>
      ))}

      {billingHistory?.hasMore && <S.LoadMoreButton onClick={loadMore}>{loading ? 'Loading...' : 'View More'}</S.LoadMoreButton>}
    </Page.Section>
  );
};

export default BillingHistory;
