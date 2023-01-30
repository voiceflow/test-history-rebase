import { toast } from '@voiceflow/ui';
import React from 'react';

import workspaceClient from '@/client/workspace';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { Billing } from '@/models';

export interface BillingHistoryAPI {
  status: Status;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isReady: boolean;
  data: Billing.PastInvoice[];
}

export enum Status {
  IDDLE,
  FETCHING,
  ERROR,
  LOADING_MORE,
}

export const useBillingHistory = (): BillingHistoryAPI => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const [billingHistory, setBillingHistory] = React.useState<Billing.InvoiceList | null>(null);
  const [status, setStatus] = React.useState(Status.IDDLE);

  const loadInvoiceData = async (cursor?: string | undefined) => {
    try {
      const newData = await workspaceClient.getInvoices(workspaceID, cursor ?? null, 10);
      setBillingHistory((prevHistory) => ({
        data: [...(prevHistory?.data ?? []), ...(newData.data ?? [])],
        hasMore: newData.hasMore,
      }));
    } catch (error) {
      setStatus(Status.ERROR);
      toast.error('Something went wrong, please retry');
    } finally {
      setStatus(Status.IDDLE);
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
  }, [workspaceID]);

  return {
    loadMore,
    hasMore: !!billingHistory?.hasMore,
    data: billingHistory?.data ?? [],
    isReady: !!billingHistory?.data,
    status,
  };
};
