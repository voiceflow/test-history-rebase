import type { Organization, OrganizationMember } from '@voiceflow/dtos';
import { RoleScope } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './organization.state';

export interface OrganizationItem extends Organization {
  normalizedMembers: Normalized<OrganizationMember>;
}

export const {
  all,
  byID: organizationByIDSelector,
  allIDs: allOrganizationIDsSelector,
  getByID,
} = createCRUDSelectors(STATE_KEY);

export const getOrganizationByIDSelector = createSelector([getByID], (getOrganizationByID) => {
  return (params: { id: string | null }): OrganizationItem | null => {
    const organization = getOrganizationByID(params);
    const members = organization?.members.filter(({ scope }) => scope === RoleScope.ORGANIZATION) ?? [];
    const normalizedMembers = Normal.normalize(members, ({ creatorID }) => creatorID.toString());
    return organization ? { ...organization, normalizedMembers } : null;
  };
});

export const allOrganizationsSelector = createSelector(
  [allOrganizationIDsSelector, getOrganizationByIDSelector],
  (ids, getOrganizationByID): OrganizationItem[] => {
    return ids.flatMap((id) => {
      const organization = getOrganizationByID({ id });
      return organization ? [organization] : [];
    });
  }
);
