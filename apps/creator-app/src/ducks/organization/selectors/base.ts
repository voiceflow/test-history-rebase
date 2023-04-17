import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { STATE_KEY } from '../constants';

export const {
  all: allOrganizationsSelector,
  byID: organizationByIDSelector,
  allIDs: allOrganizationIDsSelector,
  getByID: getOrganizationByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const organizationsWhereIsAdminSelector = createSelector(
  [allOrganizationsSelector, WorkspaceV2.workspacesWhereIsAdminOrOwnerSelector],
  (organizations, workspaces) => organizations.filter(({ id }) => workspaces.some(({ organizationID }) => id === organizationID))
);

export const currentMemberRoleByIDSelector = createSelector(
  [getOrganizationByIDSelector, idParamSelector, Account.userIDSelector],
  (getOrganization, organizationID, userID) => (userID !== null ? getOrganization({ id: organizationID })?.members.byKey[userID]?.role ?? null : null)
);
