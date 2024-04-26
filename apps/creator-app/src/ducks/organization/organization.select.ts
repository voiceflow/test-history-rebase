import type { Organization, OrganizationMember } from '@voiceflow/dtos';
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
    const normalizedMembers = Normal.normalize((organization?.members ?? []).map((m) => ({ id: m.creatorID, ...m })));
    return organization ? { ...organization, normalizedMembers } : null;
  };
});

export const allOrganizationsSelector = createSelector(
  [allOrganizationIDsSelector, getOrganizationByIDSelector],
  (ids, getOrganizationByID): OrganizationItem[] => {
    return ids.reduce<OrganizationItem[]>((acc, id) => {
      const organization = getOrganizationByID({ id });

      if (!organization) return acc;

      const normalizedMembers = Normal.normalize((organization?.members ?? []).map((m) => ({ id: m.creatorID, ...m })));
      return [...acc, { ...organization, normalizedMembers }];
    }, []);
  }
);
