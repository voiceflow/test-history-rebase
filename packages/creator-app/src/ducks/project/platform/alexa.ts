import { AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { Member } from '@voiceflow/api-sdk';
import { createSelector } from 'reselect';

import * as Errors from '@/config/errors';
import { userIDSelector } from '@/ducks/account/selectors';
import { Project } from '@/models';
import { SyncThunk } from '@/store/types';
import { Nullable } from '@/types';

import { patchProject } from '../actions';
import { activeProjectSelector } from '../selectors';

// selectors

export const activeAlexaProjectSelector = createSelector(
  [activeProjectSelector],
  (activeProject) => activeProject as Nullable<Project<AlexaProjectData, Member<AlexaProjectMemberData>>>
);

export const activeProjectMembersSelector = createSelector([activeAlexaProjectSelector], (project) => project?.members ?? []);

export const activeMemberSelector = createSelector(
  [userIDSelector, activeProjectMembersSelector],
  (creatorID, members) => members.find((member) => member.creatorID === creatorID) ?? null
);

export const activeVendorIDSelector = createSelector([activeMemberSelector], (member) => member?.platformData.selectedVendor ?? null);

export const vendorByIDSelector = createSelector(
  [activeMemberSelector],
  (member) => (vendorID: string) => member?.platformData.vendors.find((vendor) => vendor.vendorID === vendorID) ?? null
);

export const activeSkillIDSelector = createSelector(
  [activeVendorIDSelector, vendorByIDSelector],
  (vendorID, getVendor) => (vendorID && getVendor(vendorID)?.skillID) ?? null
);

// side effects

export const updateActiveVendor =
  (vendorID: string, skillID: string | null): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeProject = activeAlexaProjectSelector(state);
    const activeCreatorID = userIDSelector(state);

    if (!activeProject) throw Errors.noActiveProjectID();
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

    dispatch(patchProject(activeProject.id, { members: updatedMembers }));
  };
