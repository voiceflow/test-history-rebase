import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Feature from '@/ducks/feature';
import { projectSelector as alexaProjectSelector } from '@/ducks/projectV2/selectors/active/alexa';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

import { crud } from '../actions';

// side effects

// eslint-disable-next-line import/prefer-default-export
export const updateActiveVendor =
  (vendorID: Nullable<string>, skillID: string | null): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeProject = alexaProjectSelector(state);
    const activeCreatorID = userIDSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

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

    if (isAtomicActions) {
      Errors.assertWorkspaceID(workspaceID);

      dispatch.local(Realtime.project.crud.patch({ workspaceID, key: projectID, value: { members: updatedMembers } }));
    } else {
      dispatch(crud.patch(projectID, { members: updatedMembers }));
    }
  };
