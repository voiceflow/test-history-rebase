import { useSetAtom } from 'jotai/react';
import React from 'react';

import * as OrganizationAtoms from '@/atoms/organization.atom';
import { LoadingGate } from '@/components/LoadingGate';
import * as Organization from '@/ducks/organization';
import * as Workspace from '@/ducks/workspaceV2';
import { useOrganizationSubscription, useSelector } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const OrganizationSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const organization = useSelector(Organization.organizationSelector);
  const workspace = useSelector(Workspace.active.workspaceSelector);
  const setSubscribed = useSetAtom(OrganizationAtoms.isSubscribedAtom);
  const isSubscribed = useOrganizationSubscription({ organizationID: organization?.id, workspaceID: workspace?.id }, [
    organization?.id,
    workspace?.id,
  ]);

  React.useEffect(() => {
    setSubscribed(isSubscribed);

    return () => setSubscribed(false);
  }, [isSubscribed]);

  return (
    <LoadingGate isLoaded={isSubscribed} loader={<WorkspaceOrProjectLoader />} internalName={OrganizationSubscriptionGate.name}>
      {children}
    </LoadingGate>
  );
};

export default OrganizationSubscriptionGate;
