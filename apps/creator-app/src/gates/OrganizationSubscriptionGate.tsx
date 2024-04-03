import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Organization from '@/ducks/organization';
import * as Workspace from '@/ducks/workspaceV2';
import { useOrganizationSubscription, useSelector } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const OrganizationSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const organization = useSelector(Organization.organizationSelector);
  const workspace = useSelector(Workspace.active.workspaceSelector);
  const isSubscribed = useOrganizationSubscription({ organizationID: organization?.id, workspaceID: workspace?.id }, [
    organization?.id,
    workspace?.id,
  ]);

  return (
    <LoadingGate isLoaded={isSubscribed} loader={<WorkspaceOrProjectLoader />} internalName={OrganizationSubscriptionGate.name}>
      {children}
    </LoadingGate>
  );
};

export default OrganizationSubscriptionGate;
