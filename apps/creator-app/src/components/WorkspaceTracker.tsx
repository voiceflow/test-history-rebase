import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';

const WorkspaceTracker: React.FC = () => {
  const workspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const [trackEvents] = useTrackingEvents();

  React.useEffect(() => {
    if (!workspace) return;

    trackEvents.trackWorkspace({ workspace });
  }, [workspace?.id]);

  return null;
};

export default WorkspaceTracker;
