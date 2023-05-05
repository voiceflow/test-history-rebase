import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { allOrganizationsSelector } from './crud';

export const organizationSelector = createSelector(
  [allOrganizationsSelector, Session.activeWorkspaceIDSelector],
  (allOrganizations, workspaceID) => ({
    allOrganizations,
    workspaceID,
  })
);
