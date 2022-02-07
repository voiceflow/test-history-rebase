import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useDiagramSubscription, useSelector } from '@/hooks';

const DiagramSubscriptionGate: React.FC = ({ children }) => {
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const isSubscribed = useDiagramSubscription({ workspaceID, projectID, versionID, diagramID });

  return (
    <LoadingGate label="Diagram" isLoaded={isSubscribed}>
      {children}
    </LoadingGate>
  );
};

export default DiagramSubscriptionGate;
