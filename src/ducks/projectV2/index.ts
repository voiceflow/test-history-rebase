import { AlexaProject, AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';

import client from '@/client';
import clientV2 from '@/clientV2';
import projectAdapter from '@/clientV2/adapters/project';
import { Project } from '@/models';
import { Thunk } from '@/store/types';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from '../utils/crud';

export const STATE_KEY = 'project';

const projectReducer = createCRUDReducer<Project>(STATE_KEY);

export default projectReducer;

// selectorsvc

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

export const loadProjectsForWorkspace = (workspaceID: string): Thunk<Project[]> => async (dispatch) => {
  const dbProjects = await clientV2.api.project.list<AlexaProjectData, AlexaProjectMemberData>(workspaceID);

  const projects = projectAdapter.mapFromDB(dbProjects as AlexaProject[]);

  dispatch(replaceProjects(projects));

  return projects;
};

export const deleteProject = (projectID: string): Thunk => async (dispatch) => {
  await clientV2.api.project.delete(projectID);

  await dispatch(removeProject(projectID));
};

export const setupProjectSocketConnection = (projectID: string) => async () => {
  await client.socket?.project.initialize(projectID);
};
