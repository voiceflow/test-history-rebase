import type { SubscriptionBillingPeriod } from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useAsyncEffect, useSelector } from '@/hooks';

export interface BillingHistoryAPI {
  usageSubscription: SubscriptionBillingPeriod | null;
}

export const useUsageSubscription = () => {
  const isOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const [isReady, setIsReady] = React.useState(false);
  const [data, setData] = React.useState<SubscriptionBillingPeriod | null>(null);

  useAsyncEffect(async () => {
    setData(null);
    setIsReady(!isOnPaidPlan);

    if (!isOnPaidPlan) return;

    try {
      const newData = await client.workspace.getUsageSubscription(workspaceID);
      setData(newData);
      setIsReady(true);
    } catch (error) {
      setIsReady(true);
      if (error instanceof Error && 'statusCode' in error && error.statusCode !== 404) {
        toast.error('Something went wrong, please retry');
      }
    }
  }, [workspaceID]);

  return {
    isReady,
    data,
  };
};
