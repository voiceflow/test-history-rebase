import React from 'react';

import * as Session from '@/ducks/session';
import { useDiagramSubscription, useSelector } from '@/hooks';

const RealtimeDiagramSubscription: React.FC = () => {
  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  useDiagramSubscription({ diagramID, projectID, workspaceID });

  return null;
};

export default RealtimeDiagramSubscription;
