import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import { userIDSelector } from '@/ducks/account/selectors';
import { projectSelector as alexaProjectSelector } from '@/ducks/projectV2/selectors/active/alexa';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

// side effects

export const updateActiveVendor =
  (vendorID: Nullable<string>, skillID: string | null): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeProject = alexaProjectSelector(state);
    const activeCreatorID = userIDSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertProjectID(projectID);
    Errors.assertProject(projectID, activeProject);
    Errors.assertCreatorID(activeCreatorID);

    const updatedMembers = activeProject.members.map((member) =>
      member.creatorID === activeCreatorID
        ? {
            ...member,
            platformData: {
              ...member.platformData,
              selectedVendor: vendorID,
              vendors: member.platformData.vendors.some((vendor) => vendor.vendorID === vendorID)
                ? member.platformData.vendors.map((vendor) => (vendor.vendorID === vendorID ? { ...vendor, skillID } : vendor))
                : [...member.platformData.vendors, { vendorID, skillID, products: {} }],
            },
          }
        : member
    );

    Errors.assertWorkspaceID(workspaceID);

    dispatch(Realtime.project.crud.patch({ workspaceID, key: projectID, value: { members: updatedMembers } }));
  };
