import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { allOrganizationsSelector } from './base';

export const organizationSelector = createSelector(
  [allOrganizationsSelector, Session.activeWorkspaceIDSelector],
  (allOrganizations, workspaceID) => ({
    allOrganizations,
    workspaceID,
  })
);
