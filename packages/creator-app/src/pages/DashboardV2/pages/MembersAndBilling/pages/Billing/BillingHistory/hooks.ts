import React from 'react';

import workspaceClient from '@/client/workspace';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { Billing } from '@/models';

export interface BillingHistoryAPI {
  loading: boolean;
  loadMore: () => Promise<void>;
  billingHistory: Billing.InvoiceList | null;
}

export const useBillingHistory = () => {
  const workspaceId = useSelector(Session.activeWorkspaceIDSelector)!;
  const [billingHistory, setBillingHistory] = React.useState<Billing.InvoiceList | null>(null);
  const [loading, setLoading] = React.useState(false);

  const loadInvoiceData = async (cursor?: string | undefined) => {
    const newData = await workspaceClient.getInvoices(workspaceId, cursor ?? null, 10);

    setBillingHistory((prevHistory) => ({
      data: [...(prevHistory?.data ?? []), ...(newData.data ?? [])],
      hasMore: newData.hasMore,
    }));
  };

  const loadMore = async () => {
    if (!billingHistory?.hasMore) return;

    setLoading(true);

    const lastItem = billingHistory?.data != null ? billingHistory.data?.[billingHistory.data.length - 1] : null;
    await loadInvoiceData(lastItem?.id);
    setLoading(false);
  };

  React.useEffect(() => {
    loadInvoiceData();
  }, [workspaceId]);

  return {
    loadMore,
    loading,
    billingHistory,
  };
};
