import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { userIDSelector } from '@/ducks/account/selectors';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';
import { isAdminOrOwnerUserRole } from '@/utils/role';

import { STATE_KEY } from '../constants';

export const {
  all: allWorkspacesSelector,
  byID: workspaceByIDSelector,
  allIDs: allWorkspaceIDsSelector,
  isEmpty: workspacesEmptySelector,
  getByID: getWorkspaceByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const workspacesWhereIsAdminOrOwnerSelector = createSelector([allWorkspacesSelector, userIDSelector], (workspaces, userID) =>
  workspaces.filter(({ members }) =>
    Normal.denormalize(members).some(({ creator_id: creatorID, role }) => userID === creatorID && isAdminOrOwnerUserRole(role))
  )
);

export const isAdminOrOwnerOfAnyWorkspaceSelector = createSelector([workspacesWhereIsAdminOrOwnerSelector], (workspaces) => workspaces.length);
