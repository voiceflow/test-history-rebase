import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Organization from '@/ducks/organization';
import { useOrganizationSubscription, useSelector } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const OrganizationSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const organization = useSelector(Organization.organizationSelector);
  const isSubscribed = useOrganizationSubscription({ organizationID: organization?.id, subscriptionID: organization?.chargebeeSubscriptionID }, [
    organization?.id,
  ]);

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
