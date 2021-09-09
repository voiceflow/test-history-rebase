import React from 'react';
import { useSelector } from 'react-redux';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useFeature, useRouteWorkspaceID } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

// eslint-disable-next-line import/prefer-default-export
export const SettingsGate: React.FC = React.memo(({ children }) => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const routeWorkspaceID = useRouteWorkspaceID()!;

  const workspaceIDsV1 = useSelector(Workspace.allWorkspaceIDsSelector);
  const workspaceIDsRealtime = useSelector(WorkspaceV2.allWorkspaceIDsSelector);
  const activeWorkspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const workspaceIDs = atomicActions.isEnabled ? workspaceIDsRealtime : workspaceIDsV1;

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
