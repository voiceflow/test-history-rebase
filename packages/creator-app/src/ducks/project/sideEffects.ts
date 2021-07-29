import { ProjectLinkType, ProjectPrivacy } from '@voiceflow/api-sdk';
import { PlatformType } from '@voiceflow/internal';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import projectAdapter from '@/client/adapters/project';
import * as Errors from '@/config/errors';
import { addProjectToList } from '@/ducks/projectList/actions';
import * as Session from '@/ducks/session';
import { AnyProject } from '@/models';
import { Thunk } from '@/store/types';

import { addProject, patchProject, removeProject, replaceProjects, updateProjectName } from './actions';
import { activeProjectNameSelector, projectByIDSelector } from './selectors';

export interface CreateProjectParams {
  platform: PlatformType;
  name: string;
  image: string;
  listID?: string;
}

// side effects

export const loadProjectByID =
  (projectID: string): Thunk<AnyProject> =>
  async (dispatch) => {
    const dbProject = await client.api.project.get(projectID);

    const project = projectAdapter.fromDB(dbProject);

    dispatch(addProject(projectID, project));

    return project;
  };

export const loadProjectsByWorkspaceID =
  (workspaceID: string): Thunk<AnyProject[]> =>
  async (dispatch) => {
    const dbProjects = await client.api.project.list(workspaceID);

    const projects = projectAdapter.mapFromDB(dbProjects);
    dispatch(replaceProjects(projects));

    return projects;
  };

export const createProject =
  ({ platform, name, image, listID }: Partial<CreateProjectParams>, templateTag?: string): Thunk<AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    const platformType = platform ?? PlatformType.GENERAL;
    const templateProjectID = await client.template.getPlatformTemplate(platformType, templateTag);

    if (!templateProjectID) {
      toast.error(`no project templates exist for platform ${platformType}`);
      throw new Error('no platform project template');
    }

    try {
      const newProject = await client
        .platform(platformType)
        .project.copy(templateProjectID, { name, image, teamID: workspaceID }, { channel: templateTag?.split(':')[1] });

      if (listID) {
        dispatch(addProjectToList(listID, newProject._id));
      }

      return projectAdapter.fromDB(newProject);
    } catch (err) {
      toast.error('Error creating project, please try again later or contact support.');
      throw new Error('error creating project');
    }
  };

export const importProjectFromFile =
  (workspaceID: string, data: string): Thunk<AnyProject> =>
  async () => {
    const project = await client.api.version.import(workspaceID, JSON.parse(data));
    return projectAdapter.fromDB(project);
  };

export const deleteProject =
  (projectID: string): Thunk =>
  async (dispatch) => {
    await client.api.project.delete(projectID);

    dispatch(removeProject(projectID));
  };

export const setupProjectSocketConnection = (projectID: string) => async () => {
  await client.socket?.project.initialize(projectID);
};

// mutations

export const saveProjectPrivacy =
  (projectID: string, privacy: ProjectPrivacy): Thunk =>
  async (dispatch, getState) => {
    const project = projectByIDSelector(getState())(projectID);

    if (project.privacy !== privacy) {
      await client.api.project.update(projectID, { privacy });
      dispatch(patchProject(projectID, { privacy }));
    }
  };

export const saveProjectImage =
  (projectID: string, image: string): Thunk =>
  async (dispatch, getState) => {
    const project = projectByIDSelector(getState())(projectID);

    if (project.image !== image) {
      await client.api.project.update(projectID, { image });

      dispatch(patchProject(projectID, { image }));
    }
  };

export const saveProjectLinkType =
  (projectID: string, linkType: ProjectLinkType): Thunk =>
  async (dispatch) => {
    await client.api.project.update(projectID, { linkType });

    dispatch(patchProject(projectID, { linkType }));
  };

// active project

export const loadActiveProject = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);

  Errors.assertProjectID(projectID);

  await dispatch(loadProjectByID(projectID));
};

export const saveProjectName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    if (name === activeProjectNameSelector(state)) return;

    await client.api.project.update(projectID, { name });

    dispatch(updateProjectName(projectID, name));
  };

export const updateActiveProjectName =
  (name: string, meta?: object): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    dispatch(updateProjectName(projectID, name, meta));
  };
