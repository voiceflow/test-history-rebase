import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import { useFeature, useSelector, useWorkspaceSubscription } from '@/hooks';

const WorkspaceLoadingGate: React.FC = ({ children }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const isSubscribed = useWorkspaceSubscription({ workspaceID });

  return (
    <LoadingGate label="Workspace" zIndex={50} isLoaded={!atomicActions.isEnabled || isSubscribed} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default WorkspaceLoadingGate;
