import { createSelector } from 'reselect';

import { getOrganizationByIDSelector } from '@/ducks/organization/organization.select';
import * as Session from '@/ducks/session';

import { getWorkspaceByIDSelector } from './base';

export const activeWorkspaceSelector = createSelector(
  [getWorkspaceByIDSelector, Session.activeWorkspaceIDSelector],
  (getWorkspace, workspaceID) => getWorkspace({ id: workspaceID })
);

// calling the organization duck selector causes a initilization error
export const activeOrganizationSelector = createSelector(
  [activeWorkspaceSelector, getOrganizationByIDSelector],
  (workspace, getOrganizationByID) => {
    if (!workspace?.organizationID) return null;

    return getOrganizationByID({ id: workspace.organizationID });
  }
);
