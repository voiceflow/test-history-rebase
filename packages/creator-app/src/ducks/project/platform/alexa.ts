import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import { userIDSelector } from '@/ducks/account/selectors';
import { projectSelector as alexaProjectSelector } from '@/ducks/projectV2/selectors/active/alexa';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

// side effects

export const updateActiveVendor =
  (vendorID: Nullable<string>, skillID: Nullable<string>): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeProject = alexaProjectSelector(state);
    const activeCreatorID = userIDSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertProjectID(projectID);
    Errors.assertProject(projectID, activeProject);
    Errors.assertCreatorID(activeCreatorID);
    Errors.assertWorkspaceID(workspaceID);

    dispatch.local(Realtime.project.alexa.updateVendor({ creatorID: activeCreatorID, vendorID, skillID, projectID, workspaceID }));
  };
