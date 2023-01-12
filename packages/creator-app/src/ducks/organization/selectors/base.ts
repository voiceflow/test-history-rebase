import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import * as WorksapceV2 from '@/ducks/workspaceV2';

import { STATE_KEY } from '../constants';

export const {
  all: allOrganizationsSelector,
  byID: organizationByIDSelector,
  allIDs: allOrganizationIDsSelector,
  getByID: getOrganizationByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const organizationsWhereIsAdminSelector = createSelector(
  [allOrganizationsSelector, WorksapceV2.workspacesWhereIsAdminSelector],
  (organizations, workspaces) => organizations.filter(({ id }) => workspaces.some(({ organizationID }) => id === organizationID))
);
