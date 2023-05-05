import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import { idParamSelector } from '@/ducks/utils/crudV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { allOrganizationsSelector, getOrganizationByIDSelector } from './crud';

export const organizationsWhereIsAdminSelector = createSelector(
  [allOrganizationsSelector, WorkspaceV2.workspacesWhereIsAdminOrOwnerSelector],
  (organizations, workspaces) => organizations.filter(({ id }) => workspaces.some(({ organizationID }) => id === organizationID))
);

export const currentMemberRoleByIDSelector = createSelector(
  [getOrganizationByIDSelector, idParamSelector, Account.userIDSelector],
  (getOrganization, organizationID, userID) => (userID !== null ? getOrganization({ id: organizationID })?.members.byKey[userID]?.role ?? null : null)
);
