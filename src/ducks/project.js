import client from '@/client';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'project';

const projectReducer = createCRUDReducer(STATE_KEY);

export default projectReducer;

// selectors

export const {
  root: rootProjectsSelector,
  all: allProjectsSelector,
  map: projectsMapSelector,
  key: projectsKeySelector,
  byID: projectByIDSelector,
  has: hasProjectsSelector,
} = createCRUDSelectors(STATE_KEY);

// action creators

export const { add: addProject, update: updateProject, remove: removeProject, replace: replaceProjects } = createCRUDActionCreators(STATE_KEY);

export const updateProjectName = (id, name) => updateProject(id, { name }, true);

// side effects

export const loadProjectsForTeam = (teamID) => async (dispatch) => {
  const projects = await client.team.findProjects(teamID);

  dispatch(replaceProjects(projects));

  return projects;
};

export const deleteProject = (projectID) => async (dispatch) => {
  await client.project.delete(projectID);
  await dispatch(removeProject(projectID));
};
