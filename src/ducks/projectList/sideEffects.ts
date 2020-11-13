import _uniq from 'lodash/uniq';

import client from '@/client';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import { duckLogger } from '@/ducks/utils';
import { ProjectList } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { replace } from '@/utils/array';
import { cuid } from '@/utils/string';

import { addProjectList, addProjectToList, removeProjectFromList, removeProjectList, replaceProjectLists } from './actions';
import { DEFAULT_LIST_NAME } from './constants';
import { allProjectListsSelector, defaultProjectListSelector, projectListByIDSelector } from './selectors';

const log = duckLogger.child('projectList');

export const loadProjectLists = (workspaceID: string): Thunk => async (dispatch) => {
  try {
    const lists = await client.projectList.find(workspaceID);

    const rawProjects = await dispatch(Project.loadProjectsForWorkspace(workspaceID));

    const projectIDs = rawProjects.map(({ id }) => id);

    // determine if there are any projects not on a board
    const usedProjects = new Set();
    let normalizedLists = lists.map((list) => {
      const projects = _uniq(list.projects).filter((projectID) => projectIDs.includes(projectID) && !usedProjects.has(projectID));

      projects.forEach((projectID) => usedProjects.add(projectID));

      return {
        ...list,
        projects,
      };
    });

    const unusedProjects = new Set(projectIDs.filter((projectID) => !usedProjects.has(projectID)));

    // dump all projects not used in any of the other lists
    if (unusedProjects.size > 0) {
      const unusedProjectIDs = Array.from(unusedProjects);
      const defaultList = normalizedLists.find((list) => list.name === DEFAULT_LIST_NAME);

      if (defaultList) {
        const projects = _uniq([...defaultList.projects, ...unusedProjectIDs]);
        normalizedLists = replace(normalizedLists, normalizedLists.indexOf(defaultList), { ...defaultList, projects });
      } else {
        normalizedLists.push({
          id: cuid(),
          name: DEFAULT_LIST_NAME,
          projects: unusedProjectIDs,
        });
      }
    }

    dispatch(replaceProjectLists(normalizedLists));
  } catch (err) {
    log.error(err);
    dispatch(Modal.setError('Unable to retrieve lists'));
  }
};

export const saveProjectListsForWorkspace = (workspaceID: string): Thunk => async (_, getState) => {
  const projectLists = allProjectListsSelector(getState());

  await client.projectList.update(workspaceID, projectLists);
};

export const createNewList = (): SyncThunk<string> => (dispatch) => {
  const id = cuid();

  dispatch(addProjectList(id, { id, name: 'New List', projects: [], isNew: true }));

  return id;
};

export const addToListInWorkspace = (workspaceID: string, lists: ProjectList[], projectID: string): Thunk => async () => {
  try {
    await client.projectList.update(workspaceID, replace(lists, 0, { ...lists[0], projects: [projectID, ...lists[0].projects] }));
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const addProjectToDefaultList = (projectID: string, addToStart?: boolean): Thunk => async (dispatch, getState) => {
  const defaultList = defaultProjectListSelector(getState());

  const listID = defaultList ? defaultList.id : dispatch(createNewList());

  dispatch(addProjectToList(listID, projectID, addToStart));
};

export const deleteProjectList = (listID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const list = projectListByIDSelector(state)(listID);

  await Promise.all(list.projects.map((projectID) => dispatch(Project.deleteProject(projectID))));

  dispatch(removeProjectList(listID));
};

export const deleteProjectFromList = (listID: string, projectID: string): Thunk => async (dispatch) => {
  await dispatch(Project.deleteProject(projectID));

  dispatch(removeProjectFromList(listID, projectID));
};
