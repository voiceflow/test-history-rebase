import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import { withFeatureGate } from '@/hocs';
import { useProjectSubscription } from '@/hooks';

import { useProjectChannelReconnect } from '../ProjectLoadingGate/hooks';

export interface ProjectSubscriptionGateProps {
  workspaceID: string;
  projectID: string;
}

const ProjectSubscriptionGate: React.FC<ProjectSubscriptionGateProps> = ({ workspaceID, projectID, children }) => {
  const isSubscribed = useProjectSubscription({ projectID, workspaceID });

  useProjectChannelReconnect();

  return (
    <LoadingGate label="Project" isLoaded={isSubscribed}>
      {children}
    </LoadingGate>
  );
};

export default withFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(ProjectSubscriptionGate);
