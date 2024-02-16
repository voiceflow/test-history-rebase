import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { Account } from '@/ducks';
import { userIDSelector } from '@/ducks/account';
import { createCurriedSelector, creatorIDParamSelector } from '@/ducks/utils';
import { idParamSelector } from '@/ducks/utils/crudV2';
import { organizationIDSelector } from '@/ducks/workspaceV2/selectors/active';
import { isAdminUserRole } from '@/utils/role';

import { allOrganizationsSelector, getOrganizationByIDSelector } from '../organization.select';

export const organizationSelector = createSelector([getOrganizationByIDSelector, organizationIDSelector], (getOrganizationByID, organizationID) =>
  getOrganizationByID({ id: organizationID })
);

export const membersSelector = createSelector([organizationSelector], (organization) => organization?.normalizedMembers);

export const normalizedMembersSelector = createSelector([membersSelector], (members) => members ?? []);

export const memberByIDSelector = createSelector([membersSelector, creatorIDParamSelector], (members, creatorID) => {
  return members && creatorID !== null ? Normal.getOne(members, String(creatorID)) : null;
});

export const getMemberByIDSelector = createCurriedSelector(memberByIDSelector);

export const currentMemberRoleByIDSelector = createSelector(
  [getOrganizationByIDSelector, idParamSelector, Account.userIDSelector],
  (getOrganization, organizationID, userID) => {
    if (userID !== null) {
      const organization = getOrganization({ id: organizationID ?? null });
      return organization?.normalizedMembers.byKey[userID]?.role ?? null;
    }

    return null;
  }
);

export const organizationsWhereIsAdminSelector = createSelector([allOrganizationsSelector, userIDSelector], (organizations, userID) =>
  userID === null ? [] : organizations.filter(({ normalizedMembers }) => isAdminUserRole(Normal.getOne(normalizedMembers, String(userID))?.role))
);

export const isAdminOfAnyOrganizationSelector = createSelector([organizationsWhereIsAdminSelector], (organizations) => organizations.length > 0);
