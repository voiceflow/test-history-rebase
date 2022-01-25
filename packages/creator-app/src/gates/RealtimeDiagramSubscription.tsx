import React from 'react';

import * as Session from '@/ducks/session';
import { useDiagramSubscription, useSelector } from '@/hooks';

const RealtimeDiagramSubscription: React.FC = () => {
  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  // setting versionID: '' for now, this component will be removed in a future commit
  useDiagramSubscription({ diagramID, projectID, workspaceID, versionID: '' });

  return null;
};

export default RealtimeDiagramSubscription;
