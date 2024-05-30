import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type { ProjectAIAssistSettings } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';
import * as Normal from 'normal-store';

import client from '@/client';
import { designerClient } from '@/client/designer';
import { realtimeClient } from '@/client/realtime';
import * as Errors from '@/config/errors';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Router from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { waitAsync } from '@/ducks/utils';
import { editorMemberIDsSelector, isEnterpriseSelector, numberOfSeatsSelector } from '@/ducks/workspaceV2/selectors/active';
import { getActiveWorkspaceContext } from '@/ducks/workspaceV2/utils';
import { NLUImportModel } from '@/models/NLU';
import { SyncThunk, Thunk } from '@/store/types';
import logger from '@/utils/logger';
import { projectToLegacyBaseProject } from '@/utils/project.util';
import { isEditorUserRole } from '@/utils/role';

import { active, allEditorMemberIDs, projectByIDSelector } from './selectors';
import { idSelector } from './selectors/active/base';
import { getActiveProjectContext } from './utils';

export interface CreateProjectParams {
  nlu: NLUImportModel | null;
  project: {
    name: string | null;
    image: string | null;
    listID: string | null;
    members: Realtime.ProjectMember[];
    locales: string[];
    aiAssistSettings: ProjectAIAssistSettings | null;
  };
  modality: { type: string; platform: string };
  tracking?: Record<string, unknown>;
  templateTag?: string;
}

export const createProject =
  ({ nlu, project: projectData, tracking, modality, templateTag }: CreateProjectParams): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isEnterprise = isEnterpriseSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    const editorMembers = projectData.members.filter((member) => isEditorUserRole(member.role));

    if (editorMembers.length) {
      dispatch(checkEditorSeatLimit(editorMembers.map((member) => member.creatorID)));
    }

    try {
      const { data } = await dispatch(
        waitAsync(Actions.Assistant.CreateOne, {
          data: {
            nlu,
            modality,
            templateTag,
            projectListID: projectData.listID,
            projectLocales: projectData.locales,
            projectMembers: projectData.members,
            projectOverride: {
              name: projectData.name ?? undefined,
              image: projectData.image ?? undefined,
              aiAssistSettings: projectData.aiAssistSettings ?? undefined,
            },
          },
          context: { workspaceID },
        })
      );

      const project = Realtime.Adapters.projectAdapter.fromDB(projectToLegacyBaseProject(data.project), { members: projectData.members });
      const projectConfig = Platform.Config.getTypeConfig({ type: project.type, platform: project.platform });

      // TODO: move to realtime
      if (isEnterprise && project.aiAssistSettings.aiPlayground) {
        client.apiV3.fetch.post(`/projects/${project.id}/sendAIAssistantProjectEmail`).catch((error) => {
          logger.error(error);
          toast.error('unable to send AI agent disclaimer email');
        });
      }

      dispatch(
        Tracking.trackProjectCreated({
          ...tracking,
          source: Tracking.ProjectSourceType.NEW,
          channel: project.platform,
          modality: project.type,
          language: projectConfig.project.locale.labelMap[projectData.locales[0] ?? projectConfig.project.locale.defaultLocales[0]],
          projectID: project.id,
          workspaceID,
        })
      );

      return project;
    } catch (err) {
      toast.error('Error creating agent, please try again later or contact support.');
      throw new Error('error creating agent');
    }
  };

export const importProjectFromFile =
  (workspaceID: string, file: File): Thunk<Realtime.AnyProject> =>
  async (dispatch) => {
    // use HTTP API to import project because payload is too large for websocket
    const result = await designerClient.assistant.importFile(workspaceID, { file, clientID: realtimeClient.clientId });

    const project = Realtime.Adapters.projectAdapter.fromDB(projectToLegacyBaseProject(result.project), { members: [] });
    const projectConfig = Platform.Config.getTypeConfig({ type: project.type, platform: project.platform });

    dispatch(
      Tracking.trackProjectCreated({
        source: Tracking.ProjectSourceType.IMPORT,
        channel: project.platform,
        modality: project.type,
        language: projectConfig.project.locale.labelMap[project.locales.length ? project.locales[0] : projectConfig.project.locale.defaultLocales[0]],
        projectID: project.id,
        onboarding: false,
        workspaceID,
        source_project_id: result.sourceProjectID || undefined,
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

export const updateProjectNLUSettings =
  (projectID: string, nluSettings: BaseModels.Project.NLUSettings): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.project.crud.patch({
        ...getActiveWorkspaceContext(getState()),
        key: projectID,
        value: { nluSettings },
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
  ({ projectID, creatorID, reason }: Realtime.project.EjectUsersPayload): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const userID = userIDSelector(state);
    const activeProjectID = idSelector(state);

    if (projectID !== activeProjectID) return;

    if (creatorID !== userID || reason !== Realtime.project.EjectUsersReason.BACKUP_RESTORE) {
      dispatch(Router.goToDashboard());
    }

    if (creatorID !== userID) {
      const message =
        reason === Realtime.project.EjectUsersReason.BACKUP_RESTORE
          ? 'The agent has been restored to a previous version'
          : 'Another user has deleted the agent';

      toast.info(message);
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
      toast.error('All your editor seats are in use. Purchase additional seats to grant edit access for this agent.');

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

export const duplicateProject =
  (projectID: string, targetWorkspaceID: string, listID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const project = projectByIDSelector(state, { id: projectID });
    const sourceWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const projectConfig = Platform.Config.getTypeConfig({ type: project?.type, platform: project?.platform });

    Errors.assertProject(projectID, project);
    Errors.assertWorkspaceID(sourceWorkspaceID);

    const { data } = await dispatch(
      waitAsync(Actions.Assistant.DuplicateOne, {
        data: {
          sourceAssistantID: projectID,
          targetWorkspaceID,
          targetProjectListID: listID,
          targetAssistantOverride: { name: `${project.name} (COPY)` },
        },
        context: { workspaceID: sourceWorkspaceID },
      })
    );

    const duplicatedProject = Realtime.Adapters.projectAdapter.fromDB(projectToLegacyBaseProject(data.project), { members: [] });

    dispatch(
      Tracking.trackProjectCreated({
        source: Tracking.ProjectSourceType.DUPLICATE,
        channel: project.platform,
        modality: project.type,
        language:
          projectConfig.project.locale.labelMap[
            duplicatedProject.locales.length ? duplicatedProject.locales[0] : projectConfig.project.locale.defaultLocales[0]
          ],
        projectID: duplicatedProject.id,
        onboarding: false,
        workspaceID: targetWorkspaceID,
        source_project_id: project.id,
      })
    );
  };

export const importProject =
  (projectID: string, targetWorkspaceID: string): Thunk<Realtime.AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const project = projectByIDSelector(state, { id: projectID });
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const projectConfig = Platform.Config.getTypeConfig({ type: project?.type, platform: project?.platform });

    const { data } = await dispatch(
      waitAsync(Actions.Assistant.DuplicateOne, {
        data: {
          sourceAssistantID: projectID,
          targetWorkspaceID,
          targetAssistantOverride: project && workspaceID === targetWorkspaceID ? { name: `${project.name} (COPY)` } : undefined,
        },
        context: { workspaceID: workspaceID ?? targetWorkspaceID },
      })
    );

    const duplicatedProject = Realtime.Adapters.projectAdapter.fromDB(projectToLegacyBaseProject(data.project), { members: [] });

    dispatch(
      Tracking.trackProjectCreated({
        source: Tracking.ProjectSourceType.CLONE_LINK,
        channel: duplicatedProject.platform,
        modality: duplicatedProject.type,
        language:
          projectConfig.project.locale.labelMap[
            duplicatedProject.locales.length ? duplicatedProject.locales[0] : projectConfig.project.locale.defaultLocales[0]
          ],
        projectID: duplicatedProject.id,
        onboarding: false,
        workspaceID: targetWorkspaceID,
        source_project_id: projectID,
      })
    );

    return duplicatedProject;
  };
