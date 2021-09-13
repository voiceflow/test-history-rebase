import { UserRole } from '@voiceflow/internal';
import { createSelector } from 'reselect';

import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import { createParameterSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';
import * as WorkspaceV1Selectors from '@/ducks/workspace/selectors';

import { STATE_KEY } from '../constants';

export const workspaceIDParamSelector = createParameterSelector<{ workspaceID: string }>((params) => params.workspaceID);

const {
  all: _allWorkspacesSelector,
  byID: _workspaceByIDSelector,
  getByID: _getWorkspaceByIDSelector,
  allIDs: _allWorkspaceIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const allWorkspacesSelector = Feature.createAtomicActionsSelector([WorkspaceV1Selectors.allWorkspacesSelector, _allWorkspacesSelector]);

export const allWorkspaceIDsSelector = Feature.createAtomicActionsSelector([WorkspaceV1Selectors.allWorkspaceIDsSelector, _allWorkspaceIDsSelector]);

export const hasTemplatesWorkspaceSelector = createSelector([allWorkspacesSelector], (workspaces) => workspaces.some(({ templates }) => templates));

export const personalWorkspaceIDsSelector = createSelector([allWorkspacesSelector], (workspaces) =>
  workspaces.filter((workspace) => !workspace.templates).map((workspace) => workspace.id)
);

export const workspaceByIDSelector = Feature.createAtomicActionsSelector(
  [WorkspaceV1Selectors.workspaceByIDSelector, _workspaceByIDSelector, idParamSelector],
  (getWorkspaceV1, workspaceV2, workspaceID) => [workspaceID ? getWorkspaceV1(workspaceID) : null, workspaceV2]
);

export const getWorkspaceByIDSelector = Feature.createAtomicActionsSelector([WorkspaceV1Selectors.workspaceByIDSelector, _getWorkspaceByIDSelector]);

export const isAdminOfAnyWorkspaceSelector = createSelector([allWorkspacesSelector, Account.userIDSelector], (workspaces, userID) =>
  workspaces.some(({ members }) => members.some(({ creator_id, role }) => userID === creator_id && role === UserRole.ADMIN))
);
