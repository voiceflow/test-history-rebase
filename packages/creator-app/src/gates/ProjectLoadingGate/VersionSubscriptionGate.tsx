import React from 'react';
import { batch, useDispatch } from 'react-redux';

import LoadingGate from '@/components/LoadingGate';
import * as Creator from '@/ducks/creator';
import * as Session from '@/ducks/session';
import { useRouteDiagramID, useSelector, useTeardown, useVersionSubscription } from '@/hooks';

import ProjectSubscriptionGate from './ProjectSubscriptionGate';

export interface VersionSubscriptionGateProps {
  workspaceID: string;
  projectID: string;
  versionID: string;
}

const VersionSubscriptionGate: React.FC<VersionSubscriptionGateProps> = ({ workspaceID, projectID, versionID, children }) => {
  const diagramID = useRouteDiagramID() ?? undefined;
  const isSubscribed = useVersionSubscription({ versionID, projectID, workspaceID }, { diagramID });
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const dispatch = useDispatch();

  useTeardown(() => {
    batch(() => {
      dispatch(Creator.resetCreator());
      dispatch(Session.setActiveDiagramID(null));
      dispatch(Session.setActiveProjectID(null));
      dispatch(Session.setActiveVersionID(null));
    });
  });

  return (
    <LoadingGate label="Project" isLoaded={isSubscribed && activeVersionID === versionID}>
      <ProjectSubscriptionGate workspaceID={workspaceID} projectID={projectID}>
        {children}
      </ProjectSubscriptionGate>
    </LoadingGate>
  );
};

export default VersionSubscriptionGate;
