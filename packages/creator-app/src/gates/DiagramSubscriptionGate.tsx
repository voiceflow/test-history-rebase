import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Session from '@/ducks/session';
import { useDiagramSubscription, useSelector } from '@/hooks';
import { DiagramHeartbeatProvider } from '@/pages/Project/contexts';

const DiagramSubscriptionGate: React.FC = ({ children }) => {
  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const creatorDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const isSubscribed = useDiagramSubscription({ workspaceID, projectID, versionID, diagramID }, [workspaceID, projectID, versionID, diagramID]);

  return (
    <LoadingGate key={creatorDiagramID} label="Diagram" internalName={DiagramSubscriptionGate.name} isLoaded={!!creatorDiagramID}>
      <DiagramHeartbeatProvider diagramID={diagramID} isSubscribed={isSubscribed}>
        {children}
      </DiagramHeartbeatProvider>
    </LoadingGate>
  );
};

export default DiagramSubscriptionGate;
