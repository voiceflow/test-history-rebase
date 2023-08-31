import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { SyncThunk } from '@/store/types';

export const setActive =
  (workspaceID: string): SyncThunk =>
  (dispatch) => {
    dispatch(Session.setActiveWorkspaceID(workspaceID));
    dispatch(Feature.unsetWorkspaceFeaturesLoaded());
    dispatch(UI.setLoadingProjects(false));
  };
