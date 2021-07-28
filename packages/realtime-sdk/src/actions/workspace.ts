import { LOCAL_KEY, WORKSPACE_KEY } from '../constants';
import { Workspace } from '../models';
import { BaseCreatorPayload, BaseWorkspacePayload } from '../types';
import { createCrudActions, typeFactory } from './utils';

const workspaceType = typeFactory(WORKSPACE_KEY);
const workspaceLocalType = typeFactory(workspaceType(LOCAL_KEY));

export const crudActions = createCrudActions<BaseWorkspacePayload, Workspace>(workspaceType);

export const crudLocalActions = createCrudActions<BaseCreatorPayload, Workspace>(workspaceLocalType);
