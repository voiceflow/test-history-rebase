import client from '@/client';
import { Project } from '@/models';
import { Thunk } from '@/store/types';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'project';

const projectReducer = createCRUDReducer<Project>(STATE_KEY);

export default projectReducer;

// selectors

export const {
  root: rootProjectsSelector,
  all: allProjectsSelector,
  map: projectsMapSelector,
  key: projectsKeySelector,
  byID: projectByIDSelector,
  has: hasProjectsSelector,
} = createCRUDSelectors<Project>(STATE_KEY);

// action creators

export const { add: addProject, update: updateProject, remove: removeProject, replace: replaceProjects } = createCRUDActionCreators<Project>(
  STATE_KEY
);

export const updateProjectName = (id: string, name: string) => updateProject(id, { name }, true);

// side effects

export const loadProjectsForTeam = (teamID: string): Thunk<Project[]> => async (dispatch) => {
  const projects = await client.workspace.findProjects(teamID);

  dispatch(replaceProjects(projects));

  return projects;
};

export const deleteProject = (projectID: string): Thunk => async (dispatch) => {
  await client.project.delete(projectID);
  await dispatch(removeProject(projectID));
};
