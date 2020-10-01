import { AlexaProject, AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { ProjectPrivacy } from '@voiceflow/api-sdk';

import client from '@/client';
import clientV2, { getPlatformService } from '@/clientV2';
import projectAdapter from '@/clientV2/adapters/project';
import { toast } from '@/components/Toast';
import { PlatformType } from '@/constants';
import { addProjectToList } from '@/ducks/projectList/actions';
import { activeWorkspaceIDSelector } from '@/ducks/workspace/selectors';
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

export type createProjectParams = {
  platform: PlatformType;
  name: string;
  image?: string;
  listID?: string;
};

export const createProject = ({ platform, name, image, listID }: createProjectParams): Thunk<Project> => async (dispatch, getState) => {
  const state = getState();
  const teamID = activeWorkspaceIDSelector(state)!;

  const service = getPlatformService(platform);

  const templateProjectID = await clientV2.api.template.getPlatformTemplate(platform);
  if (!templateProjectID) {
    toast.error(`no project templates exist for platform ${platform}`);
    throw new Error('no platform project template');
  }

  try {
    const newProject = await service.project.copy(templateProjectID, { name, image, teamID });

    if (listID) {
      await dispatch(addProjectToList(listID, newProject._id));
    }

    return projectAdapter.fromDB(newProject);
  } catch (err) {
    toast.error('Error creating project, please try again later or contact support.');
    throw new Error('error creating project');
  }
};

export const updateProjectPrivacy = (projectID: string, privacy: ProjectPrivacy): Thunk => async (dispatch, getState) => {
  const project = projectByIDSelector(getState())(projectID);

  if (project.privacy !== privacy) {
    await clientV2.api.project.update(projectID, { privacy });
    dispatch(updateProject(projectID, { privacy }, true));
  }
};
