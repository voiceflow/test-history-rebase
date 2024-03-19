import React from 'react';
import { generatePath } from 'react-router-dom';

import { LoadingGate } from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useRouteWorkspaceID, useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

import { DashboardLoader } from '../components';

const DashboardGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const routeWorkspaceID = useRouteWorkspaceID();
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const workspaceIDs = useSelector(WorkspaceV2.allWorkspaceIDsSelector);

  const load = useDispatch(WorkspaceV2.setActive, routeWorkspaceID!);

  // route is /workspace/:workspaceID
  if (routeWorkspaceID) {
    if (!workspaceIDs.includes(routeWorkspaceID)) {
      return <RedirectWithSearch to={Path.DASHBOARD} />;
    }
  } else if (activeWorkspaceID && workspaceIDs.includes(activeWorkspaceID)) {
    return <RedirectWithSearch to={generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID: activeWorkspaceID })} />;
  } else if (workspaceIDs.length) {
    return <RedirectWithSearch to={generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID: workspaceIDs[0] })} />;
  }

  const isLoaded = routeWorkspaceID === activeWorkspaceID;

  return (
    <LoadingGate internalName={DashboardGate.name} isLoaded={isLoaded} load={load} loader={<DashboardLoader />}>
      {children}
    </LoadingGate>
  );
};

export default React.memo(DashboardGate);
