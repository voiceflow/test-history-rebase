import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';

const BillingSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const chargebeeSubscriptionID = useSelector(Organization.active.chargebeeSubscriptionIDSelector);
  const loadSubscription = useDispatch(Organization.loadActiveOrganizationSubscription);

  React.useEffect(() => {
    let counterID = 0;

    if (chargebeeSubscriptionID && organizationID) {
      const load = async () => {
        await loadSubscription(organizationID, chargebeeSubscriptionID);

        counterID = window.setTimeout(() => {
          load();
        }, 60 * 5000);
      };

      load();
    }

    return () => window.clearTimeout(counterID);
  }, [chargebeeSubscriptionID, organizationID]);

  return (
    <LoadingGate label="Subscription" internalName={BillingSubscriptionGate.name} zIndex={50} isLoaded backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default BillingSubscriptionGate;
