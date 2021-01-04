import { createAction } from '@/ducks/utils';
import * as CRUD from '@/ducks/utils/crud';
import { Workspace } from '@/models';
import { Action } from '@/store/types';

import { STATE_KEY } from './constants';

// actions

export enum WorkspaceAction {
  UPDATE_CURRENT_WORKSPACE = 'UPDATE_CURRENT_WORKSPACE',
}

// action types

export type UpdateCurrentWorkspace = Action<WorkspaceAction.UPDATE_CURRENT_WORKSPACE, string>;

export type AnyWorkspaceAction = UpdateCurrentWorkspace | CRUD.AnyCRUDAction<Workspace>;

// action creators

export const { patch: patchWorkspace } = CRUD.createCRUDActionCreators(STATE_KEY);

export const updateCurrentWorkspace = (workspaceID: string): UpdateCurrentWorkspace =>
  createAction(WorkspaceAction.UPDATE_CURRENT_WORKSPACE, workspaceID);
