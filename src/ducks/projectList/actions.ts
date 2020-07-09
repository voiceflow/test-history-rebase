import { AnyCRUDAction, createCRUDActionCreators } from '@/ducks/utils/crud';
import { ProjectList } from '@/models';
import { Action } from '@/store/types';

import { createAction } from '../utils';
import { STATE_KEY } from './constants';

export enum ProjectListAction {
  REMOVE_PROJECT_FROM_LIST = 'PROJECT_LIST:REMOVE_PROJECT',
  TRANSPLANT_PROJECT = 'PROJECT_LIST:TRANSPLANT_PROJECT',
  ADD_PROJECT_TO_LIST = 'PROJECT_LIST:ADD_PROJECT',
}

export type RemoveProjectFromList = Action<ProjectListAction.REMOVE_PROJECT_FROM_LIST, { listID: string; projectID: string }>;

export type TransplantProject = Action<ProjectListAction.TRANSPLANT_PROJECT, Record<'from' | 'to', { listID: string; projectID: string }>>;

export type AddProjectToList = Action<ProjectListAction.ADD_PROJECT_TO_LIST, { listID: string; projectID: string; addToStart?: boolean }>;

export type AnyProjectListAction = AnyCRUDAction<ProjectList> | RemoveProjectFromList | TransplantProject | AddProjectToList;

export const {
  add: addProjectList,
  update: updateProjectList,
  remove: removeProjectList,
  replace: replaceProjectLists,
  reorder: reorderProjectLists,
  move: moveProjectList,
} = createCRUDActionCreators<ProjectList>(STATE_KEY);

export const renameProjectList = (listID: string, name: string) => updateProjectList(listID, { name }, true);

export const clearNewProjectList = (listID: string) => updateProjectList(listID, { isNew: false }, true);

export const removeProjectFromList = (listID: string, projectID: string): RemoveProjectFromList =>
  createAction(ProjectListAction.REMOVE_PROJECT_FROM_LIST, { listID, projectID });

export const transplantProject = (from: { listID: string; projectID: string }, to: { listID: string; projectID: string }): TransplantProject =>
  createAction(ProjectListAction.TRANSPLANT_PROJECT, { from, to });

export const addProjectToList = (listID: string, projectID: string, addToStart?: boolean): AddProjectToList =>
  createAction(ProjectListAction.ADD_PROJECT_TO_LIST, { listID, projectID, addToStart });
