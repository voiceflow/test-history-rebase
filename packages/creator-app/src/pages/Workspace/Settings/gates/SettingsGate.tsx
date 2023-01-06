import React from 'react';
import { useSelector } from 'react-redux';

import LoadingGate from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useRouteWorkspaceID } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const SettingsGate: React.OldFC = React.memo(({ children }) => {
  const routeWorkspaceID = useRouteWorkspaceID();

  const workspaceIDs = useSelector(WorkspaceV2.allWorkspaceIDsSelector);
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const load = useDispatch(Workspace.setActive, routeWorkspaceID!);

  if (!routeWorkspaceID || !workspaceIDs.includes(routeWorkspaceID)) {
    return <RedirectWithSearch to={Path.DASHBOARD} />;
  }

  const isLoaded = routeWorkspaceID === activeWorkspaceID;

  return (
    <LoadingGate label="Settings" internalName={SettingsGate.name} isLoaded={isLoaded} load={load}>
      {children}
    </LoadingGate>
  );
});

export default SettingsGate;
