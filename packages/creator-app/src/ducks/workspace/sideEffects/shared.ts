import { datadogRum } from '@datadog/browser-rum';
import { batch } from 'react-redux';

import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { SyncThunk } from '@/store/types';

export const setActive =
  (workspaceID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const targetWorkspace = WorkspaceV2.getWorkspaceByIDSelector(state)({ id: workspaceID });
    const orgID = targetWorkspace?.organizationID;

    datadogRum.setUserProperty('workspace_id', workspaceID);
    datadogRum.setUserProperty('organization_id', orgID);

    batch(() => {
      dispatch(Session.setActiveWorkspaceID(workspaceID));
      dispatch(Feature.unsetWorkspaceFeaturesLoaded());
      dispatch(UI.setLoadingProjects(false));
    });
  };
