import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Session from '@/ducks/session';
import { withFeatureGate } from '@/hocs';
import { useSelector, useWorkspaceSubscription } from '@/hooks';

const WorkspaceSubscriptionGate: React.FC = ({ children }) => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const isSubscribed = useWorkspaceSubscription({ workspaceID });

  return (
    <LoadingGate label="Workspace" zIndex={50} isLoaded={isSubscribed} backgroundColor="#f9f9f9">
      {children}
    </LoadingGate>
  );
};

export default React.memo(withFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(WorkspaceSubscriptionGate));
