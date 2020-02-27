import Normalize from '@/ducks/_normalize';
import { createAction } from '@/ducks/utils';

import { STATE_KEY } from './constants';

// actions

export const UPDATE_CURRENT_WORKSPACE = 'UPDATE_CURRENT_WORKSPACE';
export const UPDATE_WORKSPACES = 'UPDATE_WORKSPACES';

// action creators

export const updateWorkspaces = ({ byId, allIds }) => createAction(UPDATE_WORKSPACES, { byId, allIds });

const Workspaces = new Normalize('id', STATE_KEY, updateWorkspaces);

export const updateWorkspace = (workspaceId, data) => (dispatch) => dispatch(Workspaces.update({ id: workspaceId, data }));

export const updateCurrentWorkspace = (workspaceId) => ({ type: UPDATE_CURRENT_WORKSPACE, payload: workspaceId });
