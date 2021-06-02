import * as CRUD from '@/ducks/utils/crud';
import { Workspace } from '@/models';

import { STATE_KEY } from './constants';

// action types

export type AnyWorkspaceAction = CRUD.AnyCRUDAction<Workspace>;

// action creators

export const { patch: patchWorkspace, replace: replaceWorkspaces, remove: removeWorkspace } = CRUD.createCRUDActionCreators(STATE_KEY);
