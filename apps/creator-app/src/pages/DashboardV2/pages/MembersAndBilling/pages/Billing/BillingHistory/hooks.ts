import { toast } from '@voiceflow/ui';
import React from 'react';

import workspaceClient from '@/client/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { Billing } from '@/models';

export interface BillingHistoryAPI {
  data: Billing.PastInvoice[];
  status: Status;
  hasMore: boolean;
  isReady: boolean;
  loadMore: () => Promise<void>;
}

export enum Status {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
  LOADING_MORE = 'LOADING_MORE',
}

export const useBillingHistory = (): BillingHistoryAPI => {
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);

  const [status, setStatus] = React.useState(Status.IDLE);
  const [billingHistory, setBillingHistory] = React.useState<Billing.InvoiceList | null>(null);

  const loadInvoiceData = async (cursor?: string) => {
    if (!workspace) return;

    try {
      const newData = await workspaceClient.getInvoices(workspace.id, cursor ?? null, 10);

      setBillingHistory((prevHistory) => ({
        data: cursor ? [...(prevHistory?.data ?? []), ...newData.data] : newData.data,
        hasMore: newData.hasMore,
      }));

      setStatus(Status.FETCHED);
    } catch (error) {
      setStatus(Status.ERROR);
      toast.error('Something went wrong, please retry');
    }
  };

  const loadMore = async () => {
    if (!billingHistory?.hasMore) return;

    setStatus(Status.LOADING_MORE);

    const lastItem = billingHistory?.data != null ? billingHistory.data?.[billingHistory.data.length - 1] : null;

    await loadInvoiceData(lastItem?.id);
  };

  React.useEffect(() => {
    setStatus(Status.FETCHING);

    loadInvoiceData();
  }, [workspace?.id, workspace?.plan, workspace?.seats]);

  return {
    data: billingHistory?.data ?? [],
    status,
    hasMore: !!billingHistory?.hasMore,
    isReady: !!billingHistory?.data,
    loadMore,
  };
};
