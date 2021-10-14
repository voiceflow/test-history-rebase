import { Action, AnyAction } from 'typescript-fsa';

import { Workspace } from '../../models';
import { BaseCreatorPayload, BaseWorkspacePayload } from '../../types';
import { ClientCRUDPayload, createAction, createCRUDActions, getCRUDActionTargets } from '../utils';
import { workspaceType } from './utils';

export * as member from './member';

// creation

export interface CreateWorkspacePayload {
  data: { name: string; image?: string };
}

export const create = createAction.async<CreateWorkspacePayload, Workspace>(workspaceType('CREATE'));

// crud

export type ClientWorkspaceCRUDPayload = ClientCRUDPayload<BaseCreatorPayload, Workspace>;

export interface LeaveWorkspacePayload extends BaseWorkspacePayload {
  creatorID: number;
}

export interface UpdateWorkspaceNamePayload extends BaseWorkspacePayload {
  name: string;
}

export interface UpdateWorkspaceImagePayload extends BaseWorkspacePayload {
  image: string;
}

export const leave = createAction<LeaveWorkspacePayload>(workspaceType('LEAVE'));

export const updateName = createAction<UpdateWorkspaceNamePayload>(workspaceType('UPDATE_NAME'));

export const updateImage = createAction<UpdateWorkspaceImagePayload>(workspaceType('UPDATE_IMAGE'));

export const crud = createCRUDActions<BaseCreatorPayload, Workspace>(workspaceType);

// utils

export const getTargetedWorkspaces = (action: AnyAction): string[] | null => {
  const targets = getCRUDActionTargets(crud, action);
  if (targets) return targets;

  const workspaceID = (action as Action<BaseWorkspacePayload | null>).payload?.workspaceID;
  return workspaceID ? [workspaceID] : null;
};
