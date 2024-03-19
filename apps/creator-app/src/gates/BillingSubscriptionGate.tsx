import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';

const BillingSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const chargebeeSubscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const loadSubscription = useDispatch(Organization.loadActiveOrganizationSubscription);

  React.useEffect(() => {
    let counterID = 0;

    if (chargebeeSubscription?.id && organizationID) {
      const load = async () => {
        await loadSubscription(organizationID, chargebeeSubscription.id);

        counterID = window.setTimeout(() => {
          load();
        }, 60 * 5000);
      };

      load();
    }

    return () => window.clearTimeout(counterID);
  }, [chargebeeSubscription?.id, organizationID]);

  return (
    <LoadingGate internalName={BillingSubscriptionGate.name} isLoaded loader={<TabLoader variant="dark" />}>
      {children}
    </LoadingGate>
  );
};

export default BillingSubscriptionGate;
