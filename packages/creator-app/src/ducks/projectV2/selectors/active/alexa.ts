import { Project as AlexaProject } from '@voiceflow/alexa-types';
import { Models as BaseModels } from '@voiceflow/base-types';
import { createSelector } from 'reselect';

import { userIDSelector } from '@/ducks/account/selectors';
import { Project } from '@/models';
import { Nullable } from '@/types';

import { projectSelector as baseProjectSelector } from './base';

export const projectSelector = createSelector(
  [baseProjectSelector],
  (activeProject) => activeProject as Nullable<Project<AlexaProject.AlexaProjectData, BaseModels.Member<AlexaProject.AlexaProjectMemberData>>>
);

const membersSelector = createSelector([projectSelector], (project) => project?.members ?? []);

const ownMemberSelector = createSelector(
  [userIDSelector, membersSelector],
  (creatorID, members) => members.find((member) => member.creatorID === creatorID) ?? null
);

export const ownVendorIDSelector = createSelector([ownMemberSelector], (member) => member?.platformData.selectedVendor ?? null);

export const getVendorByIDSelector = createSelector(
  [ownMemberSelector],
  (member) => (vendorID: string) => member?.platformData.vendors.find((vendor) => vendor.vendorID === vendorID) ?? null
);

export const ownSkillIDSelector = createSelector(
  [ownVendorIDSelector, getVendorByIDSelector],
  (vendorID, getVendor) => (vendorID ? getVendor(vendorID)?.skillID : null) ?? null
);
