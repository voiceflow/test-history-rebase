import { AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { Member } from '@voiceflow/api-sdk';
import { createSelector } from 'reselect';

import { Project } from '@/models';
import { Nullable } from '@/types';

import { createParameterSelector, creatorIDParamSelector } from '../../utils';
import { projectByIDSelector } from './base';

interface VendorIDParam {
  vendorID: string;
}

const vendorIDSelector = createParameterSelector<VendorIDParam>((params) => params.vendorID);

export const alexaProjectByIDSelector = createSelector(
  projectByIDSelector,
  (activeProject) => activeProject as Nullable<Project<AlexaProjectData, Member<AlexaProjectMemberData>>>
);

export const alexaProjectMembersByIDSelector = createSelector(
  alexaProjectByIDSelector,
  (project): Member<AlexaProjectMemberData>[] => project?.members ?? []
);

export const alexaProjectMemberByIDAndCreatorIDSelector = createSelector(
  alexaProjectMembersByIDSelector,
  creatorIDParamSelector,
  (members, creatorID) => members.find((member) => member.creatorID === creatorID) ?? null
);

export const alexaProjectSelectedVendorIDByIDAndCreatorIDSelector = createSelector(
  alexaProjectMemberByIDAndCreatorIDSelector,
  (member) => member?.platformData.selectedVendor ?? null
);

export const alexaProjectVendorByIDAndCreatorIDAndVendorID = createSelector(
  alexaProjectMemberByIDAndCreatorIDSelector,
  vendorIDSelector,
  (member, vendorID) => member?.platformData.vendors.find((vendor) => vendor.vendorID === vendorID) ?? null
);

export const alexaProjectSelectedVendorSkillIDByIDAndCreatorID = createSelector(
  alexaProjectSelectedVendorIDByIDAndCreatorIDSelector,
  (state, params) => [state, params] as const,
  (selectedVendorID, [state, params]) =>
    selectedVendorID ? alexaProjectVendorByIDAndCreatorIDAndVendorID(state, { ...params, vendorID: selectedVendorID }) : null
);
