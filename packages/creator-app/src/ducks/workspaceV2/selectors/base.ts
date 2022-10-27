import { UserRole } from '@voiceflow/internal';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import { createParameterSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';
import { createCurriedSelector } from '@/ducks/utils/selector';

import { STATE_KEY } from '../constants';

export const workspaceIDParamSelector = createParameterSelector((params: { workspaceID: string }) => params.workspaceID);

export const {
  all: allWorkspacesSelector,
  byID: workspaceByIDSelector,
  allIDs: allWorkspaceIDsSelector,
  isEmpty: workspacesEmptySelector,
  getByID: getWorkspaceByIDSelector,
} = createCRUDSelectors(STATE_KEY);

export const isAdminOfAnyWorkspaceSelector = createSelector([allWorkspacesSelector, Account.userIDSelector], (workspaces, userID) =>
  workspaces.some(({ members }) => members.some(({ creator_id: creatorID, role }) => userID === creatorID && role === UserRole.ADMIN))
);

export const allMembersSelector = createSelector([allWorkspacesSelector], (workspaces) => workspaces.flatMap(({ members }) => members));

const memberByCreatorID = createSelector([allMembersSelector, idParamSelector], (members, userID) => {
  if (!userID) return null;
  const parsedUserID = parseInt(userID, 10);
  return members.find(({ creator_id: creatorID }) => parsedUserID === creatorID);
});

export const memberByCreatorIDSelector = createCurriedSelector(memberByCreatorID);
