import { PROJECT_LIST_KEY } from '../constants';
import { ProjectList } from '../models';
import { BaseProjectPayload, BaseWorkspacePayload } from '../types';
import { createAction, createCRUDActions, typeFactory } from './utils';

const projectListType = typeFactory(PROJECT_LIST_KEY);

// Other

export interface BaseProjectListPayload extends BaseProjectPayload {
  listID: string;
}

export interface AddProjectToListPayload extends BaseProjectListPayload {
  addToStart?: boolean;
}

export interface TransplantProjectBetweenListsPayload extends BaseWorkspacePayload {
  from: { listID: string; projectID: string };
  to: { listID: string; target: string | number };
}

export const addProjectToList = createAction<AddProjectToListPayload>(projectListType('ADD_PROJECT'));

export const removeProjectFromList = createAction<BaseProjectListPayload>(projectListType('REMOVE_PROJECT'));

export const transplantProjectBetweenLists = createAction<TransplantProjectBetweenListsPayload>(projectListType('TRANSPLANT_PROJECT'));

export const crud = createCRUDActions<BaseWorkspacePayload, ProjectList>(projectListType);
