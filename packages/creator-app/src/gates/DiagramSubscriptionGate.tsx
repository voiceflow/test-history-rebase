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

  const context = React.useMemo(() => ({ workspaceID, projectID, versionID, diagramID }), [workspaceID, projectID, versionID, diagramID]);
  const isSubscribed = useDiagramSubscription(context, [context]);

  return (
    <LoadingGate key={creatorDiagramID} label="Diagram" internalName={DiagramSubscriptionGate.name} isLoaded={!!creatorDiagramID}>
      <DiagramHeartbeatProvider isSubscribed={isSubscribed} diagramID={creatorDiagramID} context={context}>
        {children}
      </DiagramHeartbeatProvider>
    </LoadingGate>
  );
};

export default DiagramSubscriptionGate;
