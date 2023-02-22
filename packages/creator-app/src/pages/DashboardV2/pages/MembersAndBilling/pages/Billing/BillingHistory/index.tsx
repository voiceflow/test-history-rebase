import { Box, Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Billing } from '@/models';

import { Status } from './hooks';
import * as S from './styles';

interface BillingHistoryProps {
  data: Billing.PastInvoice[];
  status: Status;
  hasMore: boolean;
  loadMore: VoidFunction;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ data, loadMore, status, hasMore }) => (
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
    {data.map((invoice, index) => (
      <React.Fragment key={invoice.id}>
        {index !== 0 && <SectionV2.Divider />}

        <SectionV2.SimpleSection>
          <Box.FlexApart height={20} fullWidth>
            {invoice.date}
            <Link href={invoice.pdf} target="_blank">
              View Invoice
            </Link>
          </Box.FlexApart>
        </SectionV2.SimpleSection>
      </React.Fragment>
    ))}

    {hasMore && <S.LoadMoreButton onClick={loadMore}>{status === Status.LOADING_MORE ? 'Loading...' : 'View More'}</S.LoadMoreButton>}
  </Page.Section>
);

export default BillingHistory;
