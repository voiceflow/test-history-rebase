import { AlexaProject, AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { ProjectLinkType, ProjectPrivacy } from '@voiceflow/api-sdk';

import client from '@/client';
import projectAdapter from '@/client/adapters/project';
import { toast } from '@/components/Toast';
import { DISTINCT_PLATFORMS, PlatformType } from '@/constants';
import { removeProject, replaceProjects, updateProject } from '@/ducks/project/actions';
import { addProjectToList } from '@/ducks/projectList/actions';
import { activeWorkspaceIDSelector } from '@/ducks/workspace/selectors';
import { Project } from '@/models';
import { Thunk } from '@/store/types';

import { projectByIDSelector } from './selectors';

// side effects

export const loadProjectsForWorkspace = (workspaceID: string): Thunk<Project[]> => async (dispatch) => {
  const dbProjects = await client.api.project.list<AlexaProjectData, AlexaProjectMemberData>(workspaceID);

  const projects = projectAdapter.mapFromDB(dbProjects as AlexaProject[]);

  dispatch(replaceProjects(projects));

  return projects;
};

export const deleteProject = (projectID: string): Thunk => async (dispatch) => {
  await client.api.project.delete(projectID);

  await dispatch(removeProject(projectID));
};

export const setupProjectSocketConnection = (projectID: string) => async () => {
  await client.socket?.project.initialize(projectID);
};

export type CreateProjectParams = {
  platform: PlatformType;
  name: string;
  image: string;
  listID?: string;
};

export const importProject = (workspaceID: string, data: string): Thunk<Project> => async () => {
  const project = await client.api.version.import(workspaceID, JSON.parse(data));
  return projectAdapter.fromDB(project);
};

export const createProject = ({ platform, name, image, listID }: Partial<CreateProjectParams>, templateTag?: string): Thunk<Project> => async (
  dispatch,
  getState
) => {
  const state = getState();
  const teamID = activeWorkspaceIDSelector(state)!;

  // TODO: remove this after SQL `templates` table migration + Mongo template project platform update
  const distinctPlatform = DISTINCT_PLATFORMS.includes(platform!) ? platform! : PlatformType.GENERAL;

  const templateProjectID = await client.template.getPlatformTemplate(distinctPlatform, templateTag);
  if (!templateProjectID) {
    toast.error(`no project templates exist for platform ${platform}`);
    throw new Error('no platform project template');
  }

  try {
    const newProject = await client
      .platform(platform!)
      .project.copy(templateProjectID, { name, image, teamID }, { channel: templateTag?.split(':')[1] });
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
    await client.api.project.update(projectID, { privacy });
    dispatch(updateProject(projectID, { privacy }, true));
  }
};

export const updateProjectImage = (projectID: string, image: string): Thunk => async (dispatch) => {
  await client.api.project.update(projectID, { image });

  dispatch(updateProject(projectID, { image }, true));
};

export const updateProjectLinkType = (projectID: string, linkType: ProjectLinkType): Thunk => async (dispatch) => {
  await client.api.project.update(projectID, { linkType });

  dispatch(updateProject(projectID, { linkType }, true));
};
