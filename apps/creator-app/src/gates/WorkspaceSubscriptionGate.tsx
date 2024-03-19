import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useSelector, useWorkspaceSubscription } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const WorkspaceSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const isSubscribed = useWorkspaceSubscription({ workspaceID }, [workspaceID]);

  return (
    <LoadingGate isLoaded={isSubscribed} loader={<WorkspaceOrProjectLoader />} internalName={WorkspaceSubscriptionGate.name}>
      {children}
    </LoadingGate>
  );
};

export default WorkspaceSubscriptionGate;
