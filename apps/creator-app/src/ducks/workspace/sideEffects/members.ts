import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import * as Errors from '@/config/errors';
import * as Organization from '@/ducks/organization';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';
import { isAdminUserRole, isEditorUserRole } from '@/utils/role';

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

      if (err instanceof Error && err.message.includes('unhandled error:')) {
        toast.error(getErrorMessage(err.message.split(':')[1]));
      } else {
        toast.error(getErrorMessage(err));
      }

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
      await dispatch(waitAsync(Realtime.workspace.member.sendInvite, { workspaceID, email, role: role ?? undefined }));

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

      toast.success('Cancelled invite');
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

export const updateMember =
  (workspaceID: string, creatorID: number, role: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const workspace = WorkspaceV2.workspaceByIDSelector(state, { id: workspaceID });
    const organizationMember = Organization.organizationByIDSelector(state, { id: workspace?.organizationID })?.members.byKey[creatorID] ?? null;

    try {
      if (workspace?.organizationID && isAdminUserRole(organizationMember?.role)) {
        await dispatch.sync(Realtime.organization.member.remove({ organizationID: workspace.organizationID, creatorID }));
      }

      await dispatch.sync(Realtime.workspace.member.patch({ workspaceID, creatorID, member: { role } }));
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
      await dispatch(updateMember(workspaceID, creatorID, role));
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

export const deleteMember =
  (workspaceID: string, creatorID: number): Thunk =>
  async (dispatch) => {
    try {
      await dispatch.sync(Realtime.workspace.member.remove({ workspaceID, creatorID }));
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

    dispatch(deleteMember(activeWorkspaceID, creatorID));
  };

export const updateActiveWorkspaceMemberRole =
  (member: Realtime.AnyWorkspaceMember, role: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const numberOfSeats = WorkspaceV2.active.numberOfSeatsSelector(state);
    const viewerSeatLimits = WorkspaceV2.active.viewerSeatLimitsSelector(state);
    const projectEditorMemberIDs = ProjectV2.allEditorMemberIDs(state);
    const numberOfUsedViewerSeats = WorkspaceV2.active.usedViewerSeatsSelector(state);
    const numberOfUsedEditorSeats = WorkspaceV2.active.usedEditorSeatsSelector(state);

    if (
      !isEditorUserRole(member.role) &&
      isEditorUserRole(role) &&
      numberOfUsedEditorSeats >= numberOfSeats &&
      // if the member is viewer on workspace, but editor on project, we should allow them to be editor on workspace
      (!member.creator_id || !projectEditorMemberIDs.includes(member.creator_id))
    ) {
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
