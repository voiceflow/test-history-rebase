import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';
import { usePolling } from '@/hooks/timer.hook';

const BillingSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const loadSubscription = useDispatch(Organization.loadSubscription);

  usePolling(
    {
      time: 60 * 5000,
      shouldLoad: ([subID, orgID, workspaceID]) => !!subID && !!orgID && !!workspaceID,
      callback: () => organizationID && subscription?.id && workspace?.id && loadSubscription(organizationID, subscription.id, workspace.id),
    },
    [subscription?.id, organizationID, workspace?.id]
  );

  return (
    <LoadingGate internalName={BillingSubscriptionGate.name} isLoaded loader={<TabLoader variant="dark" />}>
      {children}
    </LoadingGate>
  );
};

export default BillingSubscriptionGate;
