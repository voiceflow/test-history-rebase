import type { Invoice } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import React from 'react';

import { designerClient } from '@/client/designer';
import * as Organization from '@/ducks/organization';
import * as Workspace from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

export enum Status {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
  LOADING_MORE = 'LOADING_MORE',
}

export interface BillingHistoryAPI {
  data: Invoice[];
  status: Status;
  hasMore: boolean;
  isReady: boolean;
  loadMore: () => Promise<void>;
}

export interface BillingHistory {
  data: Invoice[];
  nextCursor: string | null;
}

export const useBillingHistory = (): BillingHistoryAPI => {
  const organization = useSelector(Organization.organizationSelector);
  const workspace = useSelector(Workspace.active.workspaceSelector);

  const [status, setStatus] = React.useState(Status.IDLE);
  const [billingHistory, setBillingHistory] = React.useState<BillingHistory | null>(null);

  const loadInvoiceData = async (cursor?: string) => {
    if (!organization || !organization.subscription?.id || !workspace) return;

    try {
      const { invoices, nextCursor } = await designerClient.billing.subscription.getInvoices(
        organization.id,
        organization.subscription.id,
        {
          ...(cursor && { cursor }),
          limit: 10,
          workspaceID: workspace.id,
        }
      );

      setBillingHistory((prevHistory) => ({
        data: cursor ? [...(prevHistory?.data ?? []), ...invoices] : invoices,
        nextCursor,
      }));

      setStatus(Status.FETCHED);
    } catch (error) {
      setStatus(Status.ERROR);
      toast.error('Something went wrong, please retry');
    }
  };

  const loadMore = async () => {
    if (!billingHistory?.nextCursor) return;

    setStatus(Status.LOADING_MORE);

    const lastItem = billingHistory?.data != null ? billingHistory.data?.[billingHistory.data.length - 1] : null;

    await loadInvoiceData(lastItem?.id);
  };

  React.useEffect(() => {
    setStatus(Status.FETCHING);

    loadInvoiceData();
  }, [organization?.subscription?.id, organization?.subscription?.plan, organization?.subscription?.editorSeats]);

  return {
    data: billingHistory?.data ?? [],
    hasMore: !!billingHistory?.nextCursor,
    status,
    isReady: !!billingHistory?.data,
    loadMore,
  };
};
