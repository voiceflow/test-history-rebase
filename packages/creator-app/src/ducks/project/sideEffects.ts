import { ProjectLinkType, ProjectPrivacy } from '@voiceflow/api-sdk';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import projectAdapter from '@/client/adapters/project';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import { addProjectToList } from '@/ducks/projectList/sideEffects/shared';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { waitActionProcessed } from '@/ducks/utils';
import { AnyProject } from '@/models';
import { Thunk } from '@/store/types';

import { addProject, patchProject, removeManyProjects, removeProject, replaceProjects } from './actions';

export interface CreateProjectParams {
  platform: Constants.PlatformType;
  name: string;
  image: string;
  listID?: string;
}

// side effects

/**
 * @deprecated remove after atomic actions complete
 */
export const loadProjectByID =
  (projectID: string): Thunk<AnyProject> =>
  async (dispatch) => {
    const dbProject = await client.api.project.get(projectID);

    const project = projectAdapter.fromDB(dbProject);

    dispatch(addProject(projectID, project));

    return project;
  };

/**
 * @deprecated remove after atomic actions complete
 */
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

    const platformType = platform ?? Constants.PlatformType.GENERAL;
    const templateProjectID = await client.template.getPlatformTemplate(platformType, templateTag);

    if (!templateProjectID) {
      toast.error(`no project templates exist for platform ${platformType}`);
      throw new Error('no platform project template');
    }

    try {
      const channel = templateTag?.split(':')[1] || platformType;
      const newProject = await client.platform(platformType).project.copy(templateProjectID, { name, image, teamID: workspaceID }, { channel });

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
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      return dispatch(waitActionProcessed<AnyProject>(Realtime.project.importProjectFromFile({ workspaceID, data })));
    }

    const project = await client.api.version.import(workspaceID, JSON.parse(data));
    return projectAdapter.fromDB(project);
  };

export const deleteProject =
  (projectID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.project.crudActions.remove({ key: projectID, workspaceID }));
    } else {
      await client.api.project.delete(projectID);

      dispatch(removeProject(projectID));
    }
  };

export const deleteManyProjects =
  (projectIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.project.crudActions.removeMany({ keys: projectIDs, workspaceID }));
    } else {
      await Promise.all(projectIDs.map((projectID) => client.api.project.delete(projectID)));

      dispatch(removeManyProjects(projectIDs));
    }
  };

export const setupProjectSocketConnection = (projectID: string) => async () => {
  await client.socket?.project.initialize(projectID);
};

// mutations

export const saveProjectPrivacy =
  (projectID: string, privacy: ProjectPrivacy): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.project.crudActions.patch({ key: projectID, value: { privacy }, workspaceID }));
    } else {
      const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

      if (project?.privacy !== privacy) {
        await client.api.project.update(projectID, { privacy });
        dispatch(patchProject(projectID, { privacy }));
      }
    }
  };

export const saveProjectImage =
  (projectID: string, image: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.project.crudActions.patch({ key: projectID, value: { image }, workspaceID }));
    } else {
      const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

      if (project?.image !== image) {
        await client.api.project.update(projectID, { image });

        dispatch(patchProject(projectID, { image }));
      }
    }
  };

export const saveProjectLinkType =
  (projectID: string, linkType: ProjectLinkType): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.project.crudActions.patch({ key: projectID, value: { linkType }, workspaceID }));
    } else {
      await client.api.project.update(projectID, { linkType });

      dispatch(patchProject(projectID, { linkType }));
    }
  };

// active project

export const loadActiveProject = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);
  const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

  if (isAtomicActions) return;

  Errors.assertProjectID(projectID);

  await dispatch(loadProjectByID(projectID));
};

export const saveProjectName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertProjectID(projectID);

    if (isAtomicActions) {
      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.project.crudActions.patch({ key: projectID, value: { name }, workspaceID }));
    } else {
      if (name === ProjectV2.active.nameSelector(state)) return;

      await client.api.project.update(projectID, { name });

      dispatch(patchProject(projectID, { name }));
    }
  };

/**
 * @deprecated remove after atomic actions complete
 */
export const updateActiveProjectName =
  (name: string, meta?: object): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    dispatch(patchProject(projectID, { name }, meta));
  };
