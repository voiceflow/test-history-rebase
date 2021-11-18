import { Models as BaseModels } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import { addProjectToList } from '@/ducks/projectList/sideEffects/shared';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { getActiveWorkspaceContext } from '@/ducks/workspace/utils';
import { Thunk } from '@/store/types';

import { crud } from './actions';

export interface CreateProjectParams {
  platform: Constants.PlatformType;
  name: string;
  image: string;
  listID?: string;
}

// side effects

const loadProjectByID =
  (projectID: string): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    const project = await client.api.project.get(projectID).then(Realtime.Adapters.projectAdapter.fromDB);

    dispatch(crud.add(projectID, project));
  };

/**
 * @deprecated these are now loaded automatically by the subscription to the workspace/:workspaceID realtime event channel
 */
export const loadProjectsByWorkspaceID =
  (workspaceID: string): Thunk<Realtime.AnyProject[]> =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return [];

    const projects = await client.api.project.list(workspaceID).then(Realtime.Adapters.projectAdapter.mapFromDB);

    dispatch(crud.replace(projects));

    return projects;
  };

export const createProject =
  ({ platform, name, image, listID }: Partial<CreateProjectParams>, templateTag?: string): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertWorkspaceID(workspaceID);

    const platformType = platform ?? Constants.PlatformType.GENERAL;
    const templateProjectID = await client.template.getPlatformTemplate(platformType, templateTag);
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    const vfVersion = isTopicsAndComponents ? Realtime.TOPICS_AND_COMPONENTS_PROJECT_VERSION : Realtime.CURRENT_PROJECT_VERSION;

    if (!templateProjectID) {
      toast.error(`no project templates exist for platform ${platformType}`);
      throw new Error('no platform project template');
    }

    try {
      const channel = templateTag?.split(':')[1] || platformType;

      if (isAtomicActions) {
        return dispatch(
          waitAsync(Realtime.project.create, {
            data: { name, image, _version: vfVersion },
            channel,
            listID,
            platform: platformType,
            templateID: templateProjectID,
            workspaceID,
          })
        );
      }

      const newProject = await client
        .platform(platformType)
        .project.copy(templateProjectID, { name, image, teamID: workspaceID, _version: vfVersion }, { channel })
        .then(Realtime.Adapters.projectAdapter.fromDB);

      if (listID) {
        dispatch(addProjectToList(listID, newProject.id));
      }

      return newProject;
    } catch (err) {
      toast.error('Error creating project, please try again later or contact support.');
      throw new Error('error creating project');
    }
  };

export const importProjectFromFile =
  (workspaceID: string, data: string): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    const vfVersion = isTopicsAndComponents ? Realtime.TOPICS_AND_COMPONENTS_PROJECT_VERSION : Realtime.CURRENT_PROJECT_VERSION;

    if (isAtomicActions) {
      return dispatch(waitAsync(Realtime.project.importFromFile, { data, vfVersion, workspaceID }));
    }

    const importJSON = JSON.parse(data);

    if (importJSON.project && typeof importJSON.project === 'object') {
      // eslint-disable-next-line no-underscore-dangle
      importJSON.project._version = vfVersion;
    }

    return client.api.version.import(workspaceID, importJSON).then(Realtime.Adapters.projectAdapter.fromDB);
  };

export const deleteProject =
  (projectID: string): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await client.api.project.delete(projectID);

          dispatch(crud.remove(projectID));
        },
        async (context) => {
          await dispatch.sync(Realtime.project.crud.remove({ ...context, key: projectID }));
        }
      )
    );

export const deleteManyProjects =
  (projectIDs: string[]): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await Promise.all(projectIDs.map((projectID) => client.api.project.delete(projectID)));

          dispatch(crud.removeMany(projectIDs));
        },
        async (context) => {
          await dispatch.sync(Realtime.project.crud.removeMany({ ...context, keys: projectIDs }));
        }
      )
    );

// mutations

export const updateProjectPrivacy =
  (projectID: string, privacy: BaseModels.ProjectPrivacy): Thunk =>
  async (dispatch, getState) => {
    const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

    if (project?.privacy === privacy) return;

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await client.api.project.update(projectID, { privacy });

          dispatch(crud.patch(projectID, { privacy }));
        },
        async (context) => {
          await dispatch.sync(Realtime.project.crud.patch({ ...context, key: projectID, value: { privacy } }));
        }
      )
    );
  };

export const updateProjectImage =
  (projectID: string, image: string): Thunk =>
  async (dispatch, getState) => {
    const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

    if (project?.image === image) return;

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await client.api.project.update(projectID, { image });

          dispatch(crud.patch(projectID, { image }));
        },
        async (context) => {
          await dispatch.sync(Realtime.project.crud.patch({ ...context, key: projectID, value: { image } }));
        }
      )
    );
  };

export const updateProjectLinkType =
  (projectID: string, linkType: BaseModels.ProjectLinkType): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await client.api.project.update(projectID, { linkType });

          dispatch(crud.patch(projectID, { linkType }));
        },
        async (context) => {
          await dispatch.sync(Realtime.project.crud.patch({ ...context, key: projectID, value: { linkType } }));
        }
      )
    );

// active project

/**
 * @deprecated project is loaded automatically by the subscription to the workspace/:workspaceID realtime event channel
 */
export const loadActiveProject = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Session.activeProjectIDSelector(state);
  const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

  if (isAtomicActions) return;

  Errors.assertProjectID(projectID);

  await dispatch(loadProjectByID(projectID));
};

export const updateProjectNameByID =
  (projectID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    if (name === ProjectV2.active.nameSelector(getState())) return;

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await client.api.project.update(projectID, { name });

          dispatch(crud.patch(projectID, { name }));
        },
        async (context) => {
          await dispatch.sync(Realtime.project.crud.patch({ ...context, key: projectID, value: { name } }));
        }
      )
    );
  };

export const updateActiveProjectName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    await dispatch(updateProjectNameByID(projectID, name));
  };
