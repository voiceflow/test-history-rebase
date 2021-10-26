import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useSelector, useVersionSubscription } from '@/hooks';

import ProjectSubscriptionGate from './ProjectSubscriptionGate';

export interface VersionSubscriptionGateProps {
  workspaceID: string;
  projectID: string;
  versionID: string;
}

const VersionSubscriptionGate: React.FC<VersionSubscriptionGateProps> = ({ workspaceID, projectID, versionID, children }) => {
  const isSubscribed = useVersionSubscription({ versionID, projectID, workspaceID });
  const activeVersionID = useSelector(Session.activeVersionIDSelector);

  return (
    <LoadingGate label="Project" isLoaded={isSubscribed && activeVersionID === versionID}>
      <ProjectSubscriptionGate workspaceID={workspaceID} projectID={projectID}>
        {children}
      </ProjectSubscriptionGate>
    </LoadingGate>
  );
};

export default VersionSubscriptionGate;
