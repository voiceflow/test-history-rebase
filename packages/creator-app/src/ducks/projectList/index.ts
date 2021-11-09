import { Utils } from '@voiceflow/common';

import createCRUDReducer from '@/ducks/utils/crud';
import { ProjectList } from '@/models';
import { Reducer, RootReducer } from '@/store/types';

import { AddProjectToList, AnyProjectListAction, ProjectListAction, RemoveProjectFromList, TransplantProject } from './actions';
import { INITIAL_STATE, STATE_KEY } from './constants';
import { ProjectListState } from './types';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

export const removeProjectFromListReducer: Reducer<ProjectListState, RemoveProjectFromList> = (state, { payload: { listID, projectID } }) => {
  const projectList = Utils.normalized.getNormalizedByKey(state, listID);

  return Utils.normalized.patchNormalizedByKey(state, listID, { projects: Utils.array.withoutValue(projectList.projects, projectID) });
};

export const transplantProjectReducer: Reducer<ProjectListState, TransplantProject> = (state, { payload: { from, to } }) => {
  if (from.listID === to.listID) {
    const list = Utils.normalized.getNormalizedByKey(state, from.listID);

    return Utils.normalized.patchNormalizedByKey(state, from.listID, {
      projects: Utils.array.reorder(
        list.projects,
        list.projects.indexOf(from.projectID),
        typeof to.target === 'number' ? to.target : list.projects.indexOf(to.target)
      ),
    });
  }

  const sourceList = Utils.normalized.getNormalizedByKey(state, from.listID);
  const targetList = Utils.normalized.getNormalizedByKey(state, to.listID);

  return {
    ...state,
    byKey: {
      ...state.byKey,
      [from.listID]: { ...sourceList, projects: Utils.array.withoutValue(sourceList.projects, from.projectID) },
      [to.listID]: {
        ...targetList,
        projects: Utils.array.insert(
          targetList.projects,
          typeof to.target === 'number' ? to.target : targetList.projects.indexOf(to.target),
          from.projectID
        ),
      },
    },
  };
};

export const addProjectToListReducer: Reducer<ProjectListState, AddProjectToList> = (state, { payload: { listID, projectID, addToStart } }) => {
  const { projects } = Utils.normalized.getNormalizedByKey(state, listID);

  return Utils.normalized.patchNormalizedByKey(state, listID, { projects: addToStart ? [projectID, ...projects] : [...projects, projectID] });
};

export const projectListCRUDReducer = createCRUDReducer<ProjectList>(STATE_KEY);

const projectListReducer: RootReducer<ProjectListState, AnyProjectListAction> = (state = INITIAL_STATE, action) => {
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
