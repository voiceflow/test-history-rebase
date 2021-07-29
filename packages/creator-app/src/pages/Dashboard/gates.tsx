import React from 'react';
import { useSelector } from 'react-redux';
import { generatePath } from 'react-router-dom';

import LoadingGate from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useRouteWorkspaceID } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

// eslint-disable-next-line import/prefer-default-export
export const DashboardGate: React.FC = React.memo(({ children }) => {
  const routeWorkspaceID = useRouteWorkspaceID();
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const workspaceIDs = useSelector(Workspace.allWorkspaceIDsSelector);
  const personalWorkspaceIDs = useSelector(Workspace.personalWorkspaceIDsSelector);

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
