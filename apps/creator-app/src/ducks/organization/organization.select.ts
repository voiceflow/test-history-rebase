import { Organization, RoleScope } from '@voiceflow/dtos';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { toLegacyOrganizationMember } from './organization.adapter';
import { STATE_KEY } from './organization.state';

export const {
  all: allOrganizationsSelector,
  byID: organizationByIDSelector,
  allIDs: allOrganizationIDsSelector,
  getByID: getOrganizationByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const getOrganizationMembers = (organization: Organization) => {
  return organization.members.filter((m) => m.scope !== RoleScope.ORGANIZATION).map(toLegacyOrganizationMember);
};
