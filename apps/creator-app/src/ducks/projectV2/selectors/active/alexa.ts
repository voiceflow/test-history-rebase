import { AlexaProject } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { userIDSelector } from '@/ducks/account/selectors';
import { createCurriedSelector } from '@/ducks/utils';
import { idParamSelector } from '@/ducks/utils/crudV2';

import { projectSelector as baseProjectSelector } from './base';

export const projectSelector = createSelector(
  [baseProjectSelector],
  (activeProject) =>
    activeProject as Nullable<Realtime.Project<AlexaProject.PlatformData, BaseModels.Project.Member<AlexaProject.MemberPlatformData>>>
);

const alexaMembersSelector = createSelector([projectSelector], (project) => project?.platformMembers);

const alexaNormalizedMembersSelector = createSelector([alexaMembersSelector], (members) => (members ? Normal.denormalize(members) : []));

const ownAlexaMemberSelector = createSelector(
  [userIDSelector, alexaNormalizedMembersSelector],
  (creatorID, members) => members.find((member) => member.creatorID === creatorID) ?? null
);

export const ownVendorIDSelector = createSelector([ownAlexaMemberSelector], (member) => member?.platformData.selectedVendor ?? null);

export const vendorByIDSelector = createSelector(
  [ownAlexaMemberSelector, idParamSelector],
  (member, vendorID) => member?.platformData.vendors.find((vendor) => vendor.vendorID === vendorID) ?? null
);

export const ownSkillIDSelector = createSelector(
  [ownVendorIDSelector, createCurriedSelector(vendorByIDSelector)],
  (vendorID, getVendor) => getVendor({ id: vendorID })?.skillID ?? null
);
