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

export type TransplantProject = Action<
  ProjectListAction.TRANSPLANT_PROJECT,
  { from: { listID: string; projectID: string }; to: { listID: string; target: string | number } }
>;

export type AddProjectToList = Action<ProjectListAction.ADD_PROJECT_TO_LIST, { listID: string; projectID: string; addToStart?: boolean }>;

export type AnyProjectListAction = AnyCRUDAction<ProjectList> | RemoveProjectFromList | TransplantProject | AddProjectToList;

/**
 * @deprecated
 */
export const crud = createCRUDActionCreators(STATE_KEY);

/**
 * @deprecated
 */
export const removeProjectFromList = (listID: string, projectID: string): RemoveProjectFromList =>
  createAction(ProjectListAction.REMOVE_PROJECT_FROM_LIST, { listID, projectID });

/**
 * @deprecated
 */
export const transplantProject = (from: { listID: string; projectID: string }, to: { listID: string; target: string | number }): TransplantProject =>
  createAction(ProjectListAction.TRANSPLANT_PROJECT, { from, to });

/**
 * @deprecated
 */
export const addProjectToListAction = (listID: string, projectID: string, addToStart?: boolean): AddProjectToList =>
  createAction(ProjectListAction.ADD_PROJECT_TO_LIST, { listID, projectID, addToStart });
