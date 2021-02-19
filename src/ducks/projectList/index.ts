import createCRUDReducer, * as CRUD from '@/ducks/utils/crud';
import { ProjectList } from '@/models';
import { Reducer, RootReducer } from '@/store/types';
import { insert, reorder, withoutValue } from '@/utils/array';
import { getNormalizedByKey, Normalized, patchNormalizedByKey } from '@/utils/normalized';

import { AddProjectToList, AnyProjectListAction, ProjectListAction, RemoveProjectFromList, TransplantProject } from './actions';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';

export const removeProjectFromListReducer: Reducer<Normalized<ProjectList>, RemoveProjectFromList> = (state, { payload: { listID, projectID } }) => {
  const projectList = getNormalizedByKey(state, listID);

  return patchNormalizedByKey(state, listID, { projects: withoutValue(projectList.projects, projectID) });
};

export const transplantProjectReducer: Reducer<Normalized<ProjectList>, TransplantProject> = (state, { payload: { from, to } }) => {
  if (from.listID === to.listID) {
    const list = getNormalizedByKey(state, from.listID);

    return patchNormalizedByKey(state, from.listID, {
      projects: reorder(list.projects, list.projects.indexOf(from.projectID), list.projects.indexOf(to.projectID)),
    });
  }

  const sourceList = getNormalizedByKey(state, from.listID);
  const targetList = getNormalizedByKey(state, to.listID);

  return {
    ...state,
    byKey: {
      ...state.byKey,
      [from.listID]: { ...sourceList, projects: withoutValue(sourceList.projects, from.projectID) },
      [to.listID]: { ...targetList, projects: insert(targetList.projects, targetList.projects.indexOf(to.projectID), from.projectID) },
    },
  };
};

export const addProjectToListReducer: Reducer<Normalized<ProjectList>, AddProjectToList> = (
  state,
  { payload: { listID, projectID, addToStart } }
) => {
  const { projects } = getNormalizedByKey(state, listID);

  return patchNormalizedByKey(state, listID, { projects: addToStart ? [projectID, ...projects] : [...projects, projectID] });
};

export const projectListCRUDReducer = createCRUDReducer<ProjectList>(STATE_KEY);

const projectListReducer: RootReducer<Normalized<ProjectList>, AnyProjectListAction> = (state = CRUD.INITIAL_STATE, action) => {
  switch (action.type) {
    case ProjectListAction.REMOVE_PROJECT_FROM_LIST:
      return removeProjectFromListReducer(state, action);
    case ProjectListAction.TRANSPLANT_PROJECT:
      return transplantProjectReducer(state, action);
    case ProjectListAction.ADD_PROJECT_TO_LIST:
      return addProjectToListReducer(state, action);
    default:
      return projectListCRUDReducer(state, action);
  }
};

export default projectListReducer;
