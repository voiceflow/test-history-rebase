import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { getActiveWorkspaceContext } from '@/ducks/workspace/utils';
import { Thunk } from '@/store/types';

export interface CreateProjectParams {
  name: string;
  image: string;
  listID?: string;
  platform: VoiceflowConstants.PlatformType;
  language?: string;
  onboarding?: boolean;
}

export const createProject =
  ({ name, image, listID, platform, language, onboarding = false }: Partial<CreateProjectParams>, templateTag?: string): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    const platformType = platform ?? VoiceflowConstants.PlatformType.GENERAL;
    const templateProjectID = await client.template.getPlatformTemplate(platformType, templateTag);
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    const vfVersion = isTopicsAndComponents ? Realtime.TOPICS_AND_COMPONENTS_PROJECT_VERSION : Realtime.CURRENT_PROJECT_VERSION;

    if (!templateProjectID) {
      toast.error(`no project templates exist for platform ${platformType}`);
      throw new Error('no platform project template');
    }

    try {
      const channel = templateTag?.split(':')[1] || platformType;

      return await dispatch(
        waitAsync(Realtime.project.create, {
          data: { name, image, _version: vfVersion },
          listID,
          channel,
          language,
          platform: platformType,
          onboarding,
          templateID: templateProjectID,
          workspaceID,
        })
      );
    } catch (err) {
      toast.error('Error creating project, please try again later or contact support.');
      throw new Error('error creating project');
    }
  };

export const importProjectFromFile =
  (workspaceID: string, data: string): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    const vfVersion = isTopicsAndComponents ? Realtime.TOPICS_AND_COMPONENTS_PROJECT_VERSION : Realtime.CURRENT_PROJECT_VERSION;

    return dispatch(waitAsync(Realtime.project.importFromFile, { data, vfVersion, workspaceID }));
  };

export const deleteProject =
  (projectID: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.project.crud.remove({
        ...getActiveWorkspaceContext(getState()),
        key: projectID,
      })
    );
  };

export const deleteManyProjects =
  (projectIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.project.crud.removeMany({ ...getActiveWorkspaceContext(getState()), keys: projectIDs }));
  };

// mutations

export const updateProjectPrivacy =
  (projectID: string, privacy: BaseModels.Project.Privacy): Thunk =>
  async (dispatch, getState) => {
    const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

    if (project?.privacy === privacy) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { privacy } }));
  };

export const updateProjectImage =
  (projectID: string, image: string): Thunk =>
  async (dispatch, getState) => {
    const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

    if (project?.image === image) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { image } }));
  };

export const updateProjectLinkType =
  (projectID: string, linkType: BaseModels.Project.LinkType): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { linkType } }));
  };

// active project

export const updateProjectNameByID =
  (projectID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    if (name === ProjectV2.active.nameSelector(getState())) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { name } }));
  };

export const updateActiveProjectName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    await dispatch(updateProjectNameByID(projectID, name));
  };
