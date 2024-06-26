import { Utils } from '@voiceflow/common';
import type { UserRole } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Account from '@/ducks/account';
import { goToDashboard, goToWorkspace } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { waitAsync } from '@/ducks/utils';
import { openError } from '@/ModalsV2/utils';
import type { SyncThunk, Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';
import { AsyncActionError } from '@/utils/logux';

import { allWorkspaceIDsSelector, workspaceByIDSelector } from '../selectors';
import { organizationIDSelector } from '../selectors/active';

export * from './members';
export * from './shared';

export const createWorkspace =
  ({
    name,
    image,
    organizationID,
  }: {
    name: string;
    image?: string | null;
    organizationID?: string | null;
  }): Thunk<Realtime.Workspace> =>
  (dispatch, getState) => {
    try {
      const activeOrganizationID = organizationIDSelector(getState());

      return dispatch(
        waitAsync(Realtime.workspace.create, {
          name,
          image: image ?? undefined,
          settings: { dashboardKanban: false },
          organizationID: organizationID ?? activeOrganizationID ?? undefined,
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
  (data: Realtime.workspace.CheckoutPayload): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();

      await dispatch(waitAsync(Realtime.workspace.checkout, data));

      dispatch(Tracking.trackUpgrade({ plan: data.plan, seats: data.seats, period: data.period }));
      dispatch(
        Tracking.trackPlanChanged({
          newPlan: data.plan,
          currentPlan: workspaceByIDSelector(state, { id: data.workspaceID })?.plan ?? PlanType.STARTER,
        })
      );
    } catch (err) {
      if (err instanceof AsyncActionError && err.code === Realtime.ErrorCode.CHECKOUT_FAILED) {
        throw new Error(err.message);
      } else if (err instanceof Error && err.message) {
        throw new Error(err.message.split(':')[1]);
      } else {
        throw new Error('Failed to upgrade to Pro, please try again later');
      }
    }
  };

export const downgradeTrial =
  (workspaceID: string): Thunk =>
  async (dispatch) => {
    await dispatch(waitAsync(Realtime.workspace.downgradeTrial, { workspaceID }));
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

export const getWorkspaceInviteLink =
  (userRole?: UserRole): Thunk<string> =>
  async (_dispatch, getState) => {
    const state = getState();

    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    const { url } = await client.identity.workspaceInvitation.getInviteLink(workspaceID, userRole);

    return url;
  };

export const goToNextWorkspace = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

  if (activeWorkspaceID) {
    dispatch(navigateToNextWorkspace(activeWorkspaceID));
  } else {
    dispatch(goToDashboard());
  }
};
