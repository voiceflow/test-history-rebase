import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import { CREATOR_APP_ENDPOINT } from '@/config';
import * as Errors from '@/config/errors';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import { projectByIDSelector } from '@/ducks/projectV2/selectors';
import { goToDashboard, goToWorkspace } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { allWorkspaceIDsSelector, allWorkspacesSelector } from '@/ducks/workspaceV2/selectors';
import { openError } from '@/ModalsV2/utils';
import { SyncThunk, Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

export * from './members';
export * from './shared';

export const createWorkspace =
  (payload: { name: string; image?: string; organizationID?: string }): Thunk<Realtime.Workspace> =>
  (dispatch, getState) => {
    try {
      const state = getState();

      const dashboardV2 = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.DASHBOARD_V2);
      const workspaces = allWorkspacesSelector(getState());

      return dispatch(
        waitAsync(Realtime.workspace.create, {
          name: payload.name,
          image: payload.image,
          organizationID: (payload.organizationID || workspaces[0]?.organizationID) ?? undefined,
          settings: {
            dashboardKanban: dashboardV2,
          },
        })
      );
    } catch (err) {
      openError({ error: getErrorMessage(err, 'Unable to create workspace') });

      throw err;
    }
  };

const navigateToNextWorkspace =
  (workspaceID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    const workspaceIDs = Utils.array.withoutValue(allWorkspaceIDsSelector(state), workspaceID);

    // default to the first existing workspace
    const newWorkspaceID = workspaceIDs.length > 0 ? workspaceIDs[0] : null;

    if (!newWorkspaceID) {
      dispatch(goToDashboard());
    } else if (newWorkspaceID !== activeWorkspaceID) {
      dispatch(goToWorkspace(newWorkspaceID));
    }
  };

export const deleteWorkspace =
  (workspaceID: string): Thunk =>
  async (dispatch) => {
    try {
      dispatch(navigateToNextWorkspace(workspaceID));

      await dispatch.sync(Realtime.workspace.crud.remove({ key: workspaceID }));
    } catch (err) {
      openError({ error: getErrorMessage(err, 'Unable to delete workspace') });

      throw err;
    }
  };

export const duplicateProject =
  (projectID: string, targetWorkspaceID: string, listID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const project = projectByIDSelector(state, { id: projectID });
    const sourceWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertProject(projectID, project);
    Errors.assertWorkspaceID(sourceWorkspaceID);

    await dispatch.sync(
      Realtime.project.duplicate.started({
        data: { name: `${project.name} (COPY)`, teamID: targetWorkspaceID, _version: Realtime.CURRENT_PROJECT_VERSION, platform: project.platform },
        listID,
        projectID,
        workspaceID: sourceWorkspaceID,
      })
    );
  };

export const importProject =
  (projectID: string, targetWorkspaceID: string): Thunk<Realtime.AnyProject> =>
  async (dispatch) => {
    return dispatch(
      waitAsync(Realtime.project.duplicate, {
        data: { teamID: targetWorkspaceID, _version: Realtime.CURRENT_PROJECT_VERSION },
        projectID,
        workspaceID: targetWorkspaceID,
      })
    );
  };

export const ejectFromWorkspace =
  ({ removed, workspaceID, workspaceName }: Realtime.workspace.member.EjectPayload): Thunk =>
  async (dispatch) => {
    dispatch(navigateToNextWorkspace(workspaceID));
    dispatch.local(Realtime.workspace.crud.remove({ key: workspaceID }));

    if (removed) {
      toast.info(`The "${workspaceName}" workspace has been removed`);
    } else {
      toast.info(`You are no longer a collaborator for "${workspaceName}" workspace`);
    }
  };

// active workspace

export const leaveActiveWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const creatorID = Account.userIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);
    Errors.assertCreatorID(creatorID);

    dispatch(navigateToNextWorkspace(workspaceID));
    dispatch.local(Realtime.workspace.crud.remove({ key: workspaceID }));

    await dispatch.sync(Realtime.workspace.leave({ creatorID, workspaceID }));

    toast.success('Successfully left workspace');
  } catch (err) {
    openError({ error: getErrorMessage(err, 'Unable to Update Members') });

    throw err;
  }
};

export const checkout =
  (data: Realtime.workspace.CheckoutWorkspacePayload): Thunk =>
  async (dispatch) => {
    await dispatch.sync(Realtime.workspace.checkout(data));
  };

export const updateActiveWorkspaceName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);

      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.workspace.updateName({ workspaceID, name }));
    } catch (err) {
      openError({ error: getErrorMessage(err, 'Invalid Workspace Name') });

      throw err;
    }
  };

export const toggleActiveWorkspaceAiAssist =
  (aiAssist: boolean): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);

      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.workspace.settings.patch({ workspaceID, settings: { aiAssist } }));

      if (!aiAssist) {
        await dispatch.sync(Realtime.project.toggleWorkspaceProjectsAiAssistOff({ workspaceID }));
      }
    } catch (err) {
      openError({ error: 'Error toggling workspace ai assist features' });

      throw err;
    }
  };

export const toggleActiveWorkspaceDashboardKanban =
  (dashboardKanban: boolean): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);

      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.workspace.settings.toggleDashboardKanban({ workspaceID, enabled: dashboardKanban }));
    } catch (err) {
      openError({ error: 'Error toggling workspace kanban mode' });

      throw err;
    }
  };

export const refreshWorkspaceQuotaDetails =
  (quotaName: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);

      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.workspace.quotas.refreshQuotaDetails({ workspaceID, quotaName }));
    } catch (err) {
      openError({ error: 'Error refreshing workspace quota' });
      throw err;
    }
  };

export const updateActiveWorkspaceImage =
  (formData: FormData): Thunk<string> =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);

      Errors.assertWorkspaceID(workspaceID);

      const { image } = await client.identity.workspace.updateImage(workspaceID, formData);

      await dispatch.sync(Realtime.workspace.updateImage({ workspaceID, image }));

      return image;
    } catch (err) {
      openError({ error: 'Error updating workspace image' });

      throw err;
    }
  };

export const updateActiveWorkspaceImageLegacy =
  (url: string | null): Thunk =>
  async (dispatch, getState) => {
    try {
      const image = url ?? '';
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);

      Errors.assertWorkspaceID(workspaceID);

      await dispatch.sync(Realtime.workspace.updateImage({ workspaceID, image }));
    } catch (err) {
      openError({ error: 'Error updating workspace image' });

      throw err;
    }
  };

export const getWorkspaceInviteLink =
  (userRole?: UserRole): Thunk<string> =>
  async (_dispatch, getState) => {
    const state = getState();

    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isIdentityWorkspaceInviteEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE);

    Errors.assertWorkspaceID(workspaceID);

    if (isIdentityWorkspaceInviteEnabled) {
      const { url } = await client.identity.workspaceInvitation.getInviteLink(workspaceID, userRole);

      return url;
    }

    const inviteCode = await client.workspace.getInviteCode(workspaceID, userRole ?? UserRole.VIEWER);

    return `${CREATOR_APP_ENDPOINT}/invite?invite_code=${encodeURIComponent(inviteCode)}`;
  };
