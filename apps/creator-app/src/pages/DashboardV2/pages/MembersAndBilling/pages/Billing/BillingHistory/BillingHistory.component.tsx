import { Invoice } from '@voiceflow/dtos';
import { Box, SectionV2 } from '@voiceflow/ui';
import { Link } from '@voiceflow/ui-next';
import React from 'react';

import Page from '@/components/Page';
import { DESIGNER_API_ENDPOINT } from '@/config';

import { Status } from './hooks';
import * as S from './styles';

interface BillingHistoryProps {
  data: Invoice[];
  status: Status;
  hasMore: boolean;
  loadMore: VoidFunction;
  organizationID: string;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ data, loadMore, status, hasMore, organizationID }) => (
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
            <Link
              href={`${DESIGNER_API_ENDPOINT}/v1alpha1/${organizationID}/billing/invoice/${invoice.id}/pdf`}
              target="_blank"
              label="View Invoice"
            />
          </Box.FlexApart>
        </SectionV2.SimpleSection>
      </React.Fragment>
    ))}

    {hasMore && <S.LoadMoreButton onClick={loadMore}>{status === Status.LOADING_MORE ? 'Loading...' : 'View More'}</S.LoadMoreButton>}
  </Page.Section>
);

export default BillingHistory;
