import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import { userIDSelector } from '@/ducks/account/selectors';
import { idParamSelector } from '@/ducks/utils/crudV2';
import { isAdminUserRole } from '@/utils/role';

import { allOrganizationsSelector, getOrganizationByIDSelector } from './crud';

export const currentMemberRoleByIDSelector = createSelector(
  [getOrganizationByIDSelector, idParamSelector, Account.userIDSelector],
  (getOrganization, organizationID, userID) => (userID !== null ? getOrganization({ id: organizationID })?.members.byKey[userID]?.role ?? null : null)
);

export const organizationsWhereIsAdminSelector = createSelector([allOrganizationsSelector, userIDSelector], (organizations, userID) =>
  userID === null ? [] : organizations.filter(({ members }) => isAdminUserRole(Normal.getOne(members, String(userID))?.role))
);

export const isAdminOfAnyOrganizationSelector = createSelector([organizationsWhereIsAdminSelector], (organizations) => organizations.length > 0);
