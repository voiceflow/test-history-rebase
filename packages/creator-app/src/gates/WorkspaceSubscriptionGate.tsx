import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { withFeatureGate } from '@/hocs';
import { useDispatch, useSelector, useWorkspaceSubscription } from '@/hooks';

const WorkspaceSubscriptionGate: React.FC = ({ children }) => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const setLoadingProjects = useDispatch(UI.setLoadingProjects);

  const isSubscribed = useWorkspaceSubscription({ workspaceID });

  React.useEffect(() => {
    setLoadingProjects(!isSubscribed);
  }, [isSubscribed]);

  return (
    <LoadingGate label="Projects" isLoaded={isSubscribed} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default withFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(WorkspaceSubscriptionGate);
