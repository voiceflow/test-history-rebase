import React from 'react';
import { useSelector } from 'react-redux';

import LoadingGate from '@/components/LoadingGate';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useRouteWorkspaceID } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

// eslint-disable-next-line import/prefer-default-export
export const SettingsGate: React.FC = React.memo(({ children }) => {
  const routeWorkspaceID = useRouteWorkspaceID()!;

  const workspaceIDs = useSelector(WorkspaceV2.allWorkspaceIDsSelector);
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const load = useDispatch(Session.setActiveWorkspaceID, routeWorkspaceID);

  if (!workspaceIDs.includes(routeWorkspaceID)) {
    return <RedirectWithSearch to={Path.DASHBOARD} />;
  }

  const isLoaded = routeWorkspaceID === activeWorkspaceID;

  return (
    <LoadingGate label="Settings" isLoaded={isLoaded} load={load}>
      {children}
    </LoadingGate>
  );
});
