import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import * as Normal from 'normal-store';

import client from '@/client';
import * as Errors from '@/config/errors';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Router from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { waitAsync } from '@/ducks/utils';
import { editorMemberIDsSelector, isEnterpriseSelector, numberOfSeatsSelector, workspaceSelector } from '@/ducks/workspaceV2/selectors/active';
import { getActiveWorkspaceContext } from '@/ducks/workspaceV2/utils';
import { SyncThunk, Thunk } from '@/store/types';
import logger from '@/utils/logger';
import { isEditorUserRole } from '@/utils/role';

import { active, allEditorMemberIDs, projectByIDSelector } from './selectors';
import { idSelector } from './selectors/active/base';
import { getActiveProjectContext } from './utils';

export interface CreateProjectParams {
  name?: string;
  image?: string;
  listID?: string;
  nluType: Platform.Constants.NLUType;
  members?: Realtime.ProjectMember[];
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  templateTag?: string;
  aiAssistSettings?: BaseModels.Project.AIAssistSettings | null;

  tracking: {
    language: string;
    onboarding: boolean;
    assistantType?: string;
  };
}

export const createProject =
  ({
    name,
    image,
    listID,
    nluType,
    members,
    tracking,
    platform,
    projectType,
    templateTag,
    aiAssistSettings,
  }: CreateProjectParams): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const workspace = workspaceSelector(state);
    const isEnterprise = isEnterpriseSelector(state);

    Errors.assertWorkspaceID(workspace?.id);

    const editorMembers = members?.filter((member) => isEditorUserRole(member.role));

    if (editorMembers?.length) {
      dispatch(checkEditorSeatLimit(editorMembers.map((member) => member.creatorID)));
    }

    const workspaceID = workspace.id;

    const platformType = Platform.Config.get(platform).is(Platform.Constants.PlatformType.VOICEFLOW) ? nluType : platform;
    const templateProjectID = await client.template.getPlatformTemplate(platformType, templateTag);

    if (!templateProjectID) {
      toast.error(`no assistant templates exist for platform ${platformType}`);
      throw new Error('no platform assistant template');
    }

    try {
      const project = await dispatch(
        waitAsync(Realtime.project.create, {
          data: { name, image, _version: Realtime.CURRENT_PROJECT_VERSION },
          listID,
          members,
          templateID: templateProjectID,
          workspaceID,
        })
      );

      dispatch(
        Tracking.trackProjectCreated({
          ...tracking,
          channel: templateTag?.split(':')[1] || platformType,
          modality: projectType,
          source: Tracking.ProjectSourceType.NEW,
          projectID: project.id,
        })
      );

      if (aiAssistSettings) {
        await dispatch.sync(Realtime.project.crud.patch({ workspaceID, key: project.id, value: { aiAssistSettings } }));

        if (isEnterprise && aiAssistSettings.aiPlayground) {
          client.apiV3.fetch.post(`/projects/${project.id}/sendAIAssistantProjectEmail`).catch((error) => {
            logger.error(error);
            toast.error('unable to send AI assistant disclaimer email');
          });
        }
      }

      return project;
    } catch (err) {
      toast.error('Error creating assistant, please try again later or contact support.');
      throw new Error('error creating assistant');
    }
  };

export const importProjectFromFile =
  (workspaceID: string, data: string): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const workspace = workspaceSelector(state);
    const importJSON = JSON.parse(data) as {
      project: BaseModels.Project.Model<any, any>;
      version: BaseVersion.Version;
      diagrams: Record<string, BaseModels.Diagram.Model<any>>;
    };

    if (importJSON.project && typeof importJSON.project === 'object') {
      importJSON.project._version = Realtime.CURRENT_PROJECT_VERSION;
    }

    // use HTTP API to import project because payload is too large for websockets
    const dbProject = await client.api.version.import(workspaceID, JSON.parse(data));

    const importedProject = Realtime.Adapters.projectAdapter.fromDB(dbProject, { members: [] });

    // If the workspace has aiAssist turned off, turn it off for the imported project as well
    const aiAssistSettings = workspace?.settings.aiAssist ? importedProject.aiAssistSettings : { aiPlayground: false };
    const project = { ...importedProject, aiAssistSettings };

    await dispatch.sync(Realtime.project.importProject({ project, workspaceID }));
    const projectConfig = Platform.Config.getTypeConfig({ type: project?.type, platform: project?.platform });

    dispatch(
      Tracking.trackProjectCreated({
        channel: project.platform,
        modality: project.type,
        source: Tracking.ProjectSourceType.IMPORT,
        onboarding: false,
        language: projectConfig.project.locale.labelMap[project.locales.length ? project.locales[0] : projectConfig.project.locale.defaultLocales[0]],
        projectID: project.id,
      })
    );

    return project;
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

    const sourceProject = projectByIDSelector(state, { id: sourceProjectID });
    const targetProject = projectByIDSelector(state, { id: targetProjectID });

    dispatch(
      Tracking.trackDomainConvert({
        sourceNLUType: sourceProject?.nlu,
        targetNLUType: targetProject?.nlu,
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
    const project = projectByIDSelector(getState(), { id: projectID });

    if (project?.privacy === privacy) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { privacy } }));
  };

export const updateProjectAPIPrivacy =
  (projectID: string, apiPrivacy: BaseModels.Project.Privacy): Thunk =>
  async (dispatch, getState) => {
    const project = projectByIDSelector(getState(), { id: projectID });

    if (project?.apiPrivacy === apiPrivacy) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { apiPrivacy } }));
  };

export const updateProjectImage =
  (projectID: string, image: string): Thunk =>
  async (dispatch, getState) => {
    const project = projectByIDSelector(getState(), { id: projectID });

    if (project?.image === image) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { image } }));
  };

export const updateProjectLinkType =
  (projectID: string, linkType: BaseModels.Project.LinkType): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { linkType } }));
  };

export const updateProjectAiAssistSettings =
  (projectID: string, aiAssistSettings: BaseModels.Project.AIAssistSettings): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.project.crud.patch({
        ...getActiveWorkspaceContext(getState()),
        key: projectID,
        value: { aiAssistSettings },
      })
    );
  };

export const updateProjectLiveVersion =
  (projectID: string, liveVersion: string): Thunk =>
  async (dispatch, getState) => {
    const project = projectByIDSelector(getState(), { id: projectID });

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
    if (name === active.nameSelector(getState())) return;

    await dispatch.sync(Realtime.project.crud.patch({ ...getActiveWorkspaceContext(getState()), key: projectID, value: { name } }));
  };

export const addCustomThemeToProject =
  (theme: BaseModels.Project.Theme): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());
    const customThemes = active.customThemesSelector(getState());

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
    const customThemes = active.customThemesSelector(getState());

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
    const customThemes = active.customThemesSelector(getState());

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

export const ejectUsersFromProject =
  ({ projectID, creatorID }: Realtime.project.EjectUsersPayload): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const userID = userIDSelector(state);
    const activeProjectID = idSelector(state);

    if (projectID !== activeProjectID) return;

    dispatch(Router.goToDashboard());

    if (creatorID !== userID) {
      toast.info(`Another user has deleted the assistant`);
    }
  };

export const checkEditorSeatLimit =
  (editorMemberIDs: number[]): SyncThunk =>
  (_, getState) => {
    const state = getState();

    const numberOfSeats = numberOfSeatsSelector(state);
    const projectEditorMemberIDs = allEditorMemberIDs(state);
    const workspaceEditorMemberIDs = editorMemberIDsSelector(state);

    const uniqueEditorMemberIDs = Utils.array
      .unique([...projectEditorMemberIDs, ...workspaceEditorMemberIDs])
      .filter((memberID) => !memberID || !editorMemberIDs.includes(memberID));

    if (uniqueEditorMemberIDs.length + editorMemberIDs.length > numberOfSeats) {
      toast.error(`All your editor seats are in use. Purchase additional seats to grant edit access for this Assistant.`);

      throw new Error('You have reached the maximum number of editor seats.');
    }
  };

export const addMember =
  (projectID: string, member: Realtime.ProjectMember): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    if (isEditorUserRole(member.role)) {
      dispatch(checkEditorSeatLimit([member.creatorID]));
    }

    await dispatch.sync(Realtime.project.member.add({ ...getActiveWorkspaceContext(state), projectID, member }));
  };

export const patchMemberRole =
  (projectID: string, creatorID: number, role: Realtime.ProjectMember['role']): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const project = projectByIDSelector(state, { id: projectID });

    if (!project) return;

    const member = Normal.getOne(project.members, String(creatorID));

    if (!member || member.role === role) return;

    if (!isEditorUserRole(member.role) && isEditorUserRole(role)) {
      dispatch(checkEditorSeatLimit([member.creatorID]));
    }

    await dispatch.sync(Realtime.project.member.patch({ ...getActiveWorkspaceContext(state), projectID, creatorID, member: { role } }));
  };

export const removeMember =
  (projectID: string, creatorID: number): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Realtime.project.member.remove({ ...getActiveWorkspaceContext(state), projectID, creatorID }));
  };

export const patchActivePlatformData =
  (platformData: Record<string, unknown>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    await dispatch.sync(Realtime.project.patchPlatformData({ ...getActiveProjectContext(state), platformData }));
  };
