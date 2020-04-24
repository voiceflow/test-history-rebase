import Normalize from '@/ducks/_normalize';
import { createAction } from '@/ducks/utils';
import { Workspace } from '@/models';
import { Action, ActionPayload, SyncThunk } from '@/store/types';

import { STATE_KEY } from './constants';

// actions

export enum WorkspaceAction {
  UPDATE_CURRENT_WORKSPACE = 'UPDATE_CURRENT_WORKSPACE',
  UPDATE_WORKSPACES = 'UPDATE_WORKSPACES',
}

// action types

export type UpdateCurrentWorkspace = Action<WorkspaceAction.UPDATE_CURRENT_WORKSPACE, string>;

export type UpdateWorkspaces = Action<WorkspaceAction.UPDATE_WORKSPACES, { byId: Record<string, Workspace>; allIds: string[] }>;

export type AnyWorkspaceAction = UpdateCurrentWorkspace | UpdateWorkspaces;

// action creators

export const updateWorkspaces = ({ byId, allIds }: ActionPayload<UpdateWorkspaces>): UpdateWorkspaces =>
  createAction(WorkspaceAction.UPDATE_WORKSPACES, { byId, allIds });

const Workspaces = new Normalize('id', STATE_KEY, updateWorkspaces);

export const updateWorkspace = (workspaceID: string, data: Partial<Workspace>): SyncThunk => Workspaces.update({ id: workspaceID, data });

export const updateCurrentWorkspace = (workspaceID: string): UpdateCurrentWorkspace =>
  createAction(WorkspaceAction.UPDATE_CURRENT_WORKSPACE, workspaceID);
