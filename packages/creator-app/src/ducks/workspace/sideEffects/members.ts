import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import * as Errors from '@/config/errors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { trackInvitationCancelled, trackInvitationSent } from '@/ducks/tracking/events/invitation';
import { waitAsync } from '@/ducks/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { openError } from '@/ModalsV2/utils';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';
import { isEditorUserRole } from '@/utils/role';

import { setActive } from './shared';

export const acceptInvite =
  (invite: string, redirect?: () => void): Thunk<string | null> =>
  async (dispatch) => {
    try {
      const workspaceID = await dispatch(waitAsync(Realtime.workspace.member.acceptInvite, { invite }));

      dispatch(setActive(workspaceID));

      return workspaceID;
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && err.code === Realtime.ErrorCode.ALREADY_MEMBER_OF_WORKSPACE) {
        toast.success('You are already a member of this workspace.');
        redirect?.();
        return null;
      }

      openError({ error: getErrorMessage(err) });
      return null;
    }
  };

export const sendInviteToActiveWorkspace =
  ({ email, role, showToast = true }: { email: string; role: UserRole; showToast?: boolean }): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    try {
      const newMember = await dispatch(waitAsync(Realtime.workspace.member.sendInvite, { workspaceID, email, role }));
      const isIdentityWorkspaceInviteEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE);

      if (newMember && !isIdentityWorkspaceInviteEnabled) {
        dispatch(trackInvitationSent(workspaceID, email));
      }

      if (showToast) {
        toast.success('Sent invite');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

export const updateInviteToActiveWorkspace =
  (email: string, role: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await dispatch.sync(Realtime.workspace.member.updateInvite({ workspaceID: activeWorkspaceID, email, role }));

      toast.success('Updated permissions');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

export const cancelInviteToActiveWorkspace =
  (email: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await dispatch.sync(Realtime.workspace.member.cancelInvite({ workspaceID: activeWorkspaceID, email }));
      const isIdentityWorkspaceInviteEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE);

      if (!isIdentityWorkspaceInviteEnabled) {
        dispatch(trackInvitationCancelled(activeWorkspaceID, email));
      }

      toast.success('Cancelled invite');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

export const updateMemberOfActiveWorkspace =
  (creatorID: number, role: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    try {
      await dispatch.sync(Realtime.workspace.member.patch({ workspaceID, creatorID, member: { role } }));
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

export const deleteMemberOfActiveWorkspace =
  (creatorID: number): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await dispatch.sync(Realtime.workspace.member.remove({ workspaceID: activeWorkspaceID, creatorID }));
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

export const updateActiveWorkspaceMemberRole =
  (member: Realtime.AnyWorkspaceMember, role: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const numberOfSeats = WorkspaceV2.active.numberOfSeatsSelector(state);
    const viewerSeatLimits = WorkspaceV2.active.viewerSeatLimitsSelector(state);
    const numberOfUsedViewerSeats = WorkspaceV2.active.usedViewerSeatsSelector(state);
    const numberOfUsedEditorSeats = WorkspaceV2.active.usedEditorSeatsSelector(state);

    if (role === member.role) {
      return;
    }

    if (!isEditorUserRole(member.role) && isEditorUserRole(role) && numberOfUsedEditorSeats >= numberOfSeats) {
      toast.error('You have reached your max editor seats usage.');
      return;
    }

    if (role === UserRole.VIEWER && numberOfUsedViewerSeats >= viewerSeatLimits) {
      toast.error('You have reached your max viewer seats usage.');
      return;
    }

    if (member.creator_id === null) {
      await dispatch(updateInviteToActiveWorkspace(member.email, role));
    } else {
      await dispatch(updateMemberOfActiveWorkspace(member.creator_id, role));
    }
  };
