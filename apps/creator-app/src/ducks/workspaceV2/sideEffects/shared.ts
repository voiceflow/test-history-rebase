import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

export const setActive =
  (workspaceID: string): SyncThunk =>
  (dispatch) => {
    dispatch(Session.setActiveWorkspaceID(workspaceID));
  };
