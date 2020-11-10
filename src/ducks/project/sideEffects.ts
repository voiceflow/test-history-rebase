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

import { removeProject, replaceProjects, updateProject } from './actions';
import { projectByIDSelector } from './selectors';

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

export type CreateProjectParams = {
  platform: PlatformType;
  name: string;
  largeIcon: string;
  listID?: string;
};

export const createProject = ({ platform, name, largeIcon, listID }: Partial<CreateProjectParams>, templateTag?: string): Thunk<Project> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const teamID = activeWorkspaceIDSelector(state)!;

  const service = getPlatformService(platform!);

  const templateProjectID = await clientV2.api.template.getPlatformTemplate(platform!, templateTag);
  if (!templateProjectID) {
    toast.error(`no project templates exist for platform ${platform}`);
    throw new Error('no platform project template');
  }

  try {
    const newProject = await service.project.copy(templateProjectID, { name, image: largeIcon, teamID });
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
