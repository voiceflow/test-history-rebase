import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { useActiveWorkspace, useOrganizationSubscription } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const OrganizationSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const organizationID = useActiveWorkspace()?.organizationID;
  const isSubscribed = useOrganizationSubscription({ organizationID }, [organizationID]);

  return (
    <LoadingGate
      label="Organization"
      isLoaded={isSubscribed}
      component={WorkspaceOrProjectLoader}
      internalName={OrganizationSubscriptionGate.name}
      backgroundColor="#f9f9f9"
    >
      {children}
    </LoadingGate>
  );
};

export default OrganizationSubscriptionGate;
