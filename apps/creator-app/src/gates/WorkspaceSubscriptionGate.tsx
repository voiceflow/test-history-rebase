import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector, useWorkspaceSubscription } from '@/hooks';

import WorkspaceOrProjectLoader from './WorkspaceOrProjectLoader';

const WorkspaceSubscriptionGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const setLoadingProjects = useDispatch(UI.setLoadingProjects);

  const isSubscribed = useWorkspaceSubscription({ workspaceID }, [workspaceID]);

  React.useEffect(() => {
    setLoadingProjects(!isSubscribed);
  }, [isSubscribed]);

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
