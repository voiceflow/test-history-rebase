import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
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
  templateTag?: string;
}

export const createProject =
  ({ name, image, listID, platform, language, onboarding = false, templateTag }: Partial<CreateProjectParams>): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    const platformType = platform ?? VoiceflowConstants.PlatformType.VOICEFLOW;
    const templateProjectID = await client.template.getPlatformTemplate(platformType, templateTag);

    if (!templateProjectID) {
      toast.error(`no project templates exist for platform ${platformType}`);
      throw new Error('no platform project template');
    }

    try {
      const channel = templateTag?.split(':')[1] || platformType;

      return await dispatch(
        waitAsync(Realtime.project.create, {
          data: { name, image, _version: Realtime.CURRENT_PROJECT_VERSION },
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
  async (dispatch) => {
    return dispatch(waitAsync(Realtime.project.importFromFile, { data, vfVersion: Realtime.CURRENT_PROJECT_VERSION, workspaceID }));
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

export const mergeProjects =
  (sourceProjectID: string, targetProjectID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const sourceProject = ProjectV2.projectByIDSelector(state, { id: sourceProjectID });
    const targetProject = ProjectV2.projectByIDSelector(state, { id: targetProjectID });

    dispatch(
      Tracking.trackDomainConvert({
        sourcePlatform: sourceProject?.platform,
        targetPlatform: targetProject?.platform,
        sourceProjectID,
        targetProjectID,
      })
    );

    await dispatch(
      waitAsync(Realtime.project.merge, {
        ...getActiveWorkspaceContext(state),
        sourceProjectID,
        targetProjectID,
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

export const updateProjectAPIPrivacy =
  (projectID: string, apiPrivacy: BaseModels.Project.Privacy): Thunk =>
  async (dispatch, getState) => {
    const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

    if (project?.apiPrivacy === apiPrivacy) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { apiPrivacy } }));
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

export const updateProjectLiveVersion =
  (projectID: string, liveVersion: string): Thunk =>
  async (dispatch, getState) => {
    const project = ProjectV2.projectByIDSelector(getState(), { id: projectID });

    if (project?.liveVersion === liveVersion) return;

    await dispatch.sync(
      Realtime.project.crud.patch(
        { ...getActiveWorkspaceContext(getState()), key: projectID, value: { liveVersion } },
        {
          /**
           * The `liveVersion` should only be updated by backend publishing logic. No need for
           * Logux to send a patch request to the backend to redundantly update `liveVersion`.
           */
          skipPersist: true,
        }
      )
    );
  };

// active project

export const updateProjectNameByID =
  (projectID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    if (name === ProjectV2.active.nameSelector(getState())) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { name } }));
  };

export const addCustomThemeToProject =
  (theme: BaseModels.Project.Theme): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());
    const customThemes = ProjectV2.active.customThemesSelector(getState());

    if (customThemes.find(({ standardColor }) => standardColor === theme.standardColor)) return;

    Errors.assertProjectID(projectID);

    await dispatch.sync(
      Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { customThemes: [...customThemes, theme] } })
    );
  };

export const editCustomThemeOnProject =
  (theme: BaseModels.Project.Theme): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());
    const customThemes = ProjectV2.active.customThemesSelector(getState());

    if (!customThemes.find(({ standardColor }) => standardColor === theme.standardColor)) return;

    Errors.assertProjectID(projectID);

    await dispatch.sync(
      Realtime.project.crud.patch({
        ...getActiveWorkspaceContext(getState()),
        key: projectID,
        value: { customThemes: customThemes.map((oldTheme) => (oldTheme.standardColor === theme.standardColor ? theme : oldTheme)) },
      })
    );
  };

export const removeCustomThemeOnProject =
  (theme: BaseModels.Project.Theme): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());
    const customThemes = ProjectV2.active.customThemesSelector(getState());

    Errors.assertProjectID(projectID);

    await dispatch.sync(
      Realtime.project.crud.patch({
        ...getActiveWorkspaceContext(getState()),
        key: projectID,
        value: { customThemes: customThemes.filter((oldTheme) => oldTheme.standardColor !== theme.standardColor) },
      })
    );
  };

export const updateActiveProjectName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    await dispatch(updateProjectNameByID(projectID, name));
  };
