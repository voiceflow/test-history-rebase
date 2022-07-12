import { UserRole } from '@voiceflow/internal';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import { createCurriedSelector, createParameterSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from '../constants';

export const workspaceIDParamSelector = createParameterSelector((params: { workspaceID: string }) => params.workspaceID);

export const {
  all: allWorkspacesSelector,
  byID: workspaceByIDSelector,
  allIDs: allWorkspaceIDsSelector,
  isEmpty: workspacesEmptySelector,
} = createCRUDSelectors(STATE_KEY);

export const getWorkspaceByIDSelector = createCurriedSelector(workspaceByIDSelector);

export const isAdminOfAnyWorkspaceSelector = createSelector([allWorkspacesSelector, Account.userIDSelector], (workspaces, userID) =>
  workspaces.some(({ members }) => members.some(({ creator_id, role }) => userID === creator_id && role === UserRole.ADMIN))
);
