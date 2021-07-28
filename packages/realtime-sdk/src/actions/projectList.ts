import { PROJECT_LIST_KEY } from '../constants';
import { ProjectList } from '../models';
import { BaseProjectPayload, BaseWorkspacePayload } from '../types';
import { createAction, createCrudActions, typeFactory } from './utils';

const projectListType = typeFactory(PROJECT_LIST_KEY);

// Other

export interface AddProjectToListPayload extends BaseProjectPayload {
  listID: string;
  addToStart?: boolean;
}

export interface RemoveProjectFromListPayload extends BaseProjectPayload {
  listID: string;
}

export interface TransplantProjectBetweenListsPayload extends BaseWorkspacePayload {
  to: { listID: string; projectID: string };
  from: { listID: string; projectID: string };
}

export const crudActions = createCrudActions<BaseWorkspacePayload, ProjectList>(projectListType);

export const transplantProjectBetweenLists = createAction<TransplantProjectBetweenListsPayload>(projectListType('TRANSPLANT_PROJECT'));
