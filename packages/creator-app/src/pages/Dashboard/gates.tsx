import React from 'react';
import { useSelector } from 'react-redux';
import { generatePath } from 'react-router-dom';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useFeature, useRealtimeSelector, useRouteWorkspaceID } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

// eslint-disable-next-line import/prefer-default-export
export const DashboardGate: React.FC = React.memo(({ children }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const routeWorkspaceID = useRouteWorkspaceID();
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const workspaceIDsV1 = useSelector(Workspace.allWorkspaceIDsSelector);
  const workspaceIDsRealtime = useRealtimeSelector(RealtimeWorkspace.allWorkspaceIDsSelector);
  const personalWorkspaceIDsV1 = useSelector(Workspace.personalWorkspaceIDsSelector);
  const personalWorkspaceIDsRealtime = useRealtimeSelector(RealtimeWorkspace.personalWorkspaceIDsSelector);

  const workspaceIDs = atomicActions.isEnabled ? workspaceIDsRealtime : workspaceIDsV1;
  const personalWorkspaceIDs = atomicActions.isEnabled ? personalWorkspaceIDsRealtime : personalWorkspaceIDsV1;

  const load = useDispatch(Session.setActiveWorkspaceID, routeWorkspaceID);

  // route is /workspace/:workspaceID
  if (routeWorkspaceID) {
    if (!workspaceIDs.includes(routeWorkspaceID)) {
      return <RedirectWithSearch to={Path.DASHBOARD} />;
    }
  } else if (activeWorkspaceID && workspaceIDs.includes(activeWorkspaceID)) {
    return <RedirectWithSearch to={generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID: activeWorkspaceID })} />;
  } else if (personalWorkspaceIDs.length) {
    return <RedirectWithSearch to={generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID: personalWorkspaceIDs[0] })} />;
  }

  const isLoaded = routeWorkspaceID === activeWorkspaceID;

  return (
    <LoadingGate label="Dashboard" isLoaded={isLoaded} load={load}>
      {children}
    </LoadingGate>
  );
});
