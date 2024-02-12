import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useSelector, useWorkspaceSubscription } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const WorkspaceSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const isSubscribed = useWorkspaceSubscription({ workspaceID }, [workspaceID]);

  return (
    <LoadingGate
      label="Assistants"
      isLoaded={isSubscribed}
      component={WorkspaceOrProjectLoader}
      internalName={WorkspaceSubscriptionGate.name}
      backgroundColor="#f9f9f9"
    >
      {children}
    </LoadingGate>
  );
};

export default WorkspaceSubscriptionGate;
