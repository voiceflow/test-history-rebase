import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import * as Errors from '@/config/errors';
import { EDITOR_SEAT_ROLES } from '@/constants';
import * as Session from '@/ducks/session';
import { trackInvitationCancelled, trackInvitationSent } from '@/ducks/tracking/events/invitation';
import { waitAsync } from '@/ducks/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { openError } from '@/ModalsV2/utils';
import { Thunk } from '@/store/types';

import { extractErrorMessages } from '../utils';
import { setActive } from './shared';

export const acceptInvite =
  (invite: string, redirect?: () => void): Thunk<string | null> =>
  async (dispatch) => {
    try {
      const workspaceID = await dispatch(waitAsync(Realtime.workspace.member.acceptInvite, { invite }));

      dispatch(setActive(workspaceID));

      return workspaceID;
    } catch (err) {
      if (err?.code === Realtime.ErrorCode.ALREADY_MEMBER_OF_WORKSPACE) {
        toast.success('You are already a member of this workspace.');
        redirect?.();
        return null;
      }

      openError({ error: err });
      return null;
    }
  };

export const sendInviteToActiveWorkspace =
  (email: string, role: UserRole | null, showToast = true): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    try {
      const newMember = await dispatch(waitAsync(Realtime.workspace.member.sendInvite, { workspaceID, email, role: role ?? undefined }));

      if (newMember) {
        dispatch(trackInvitationSent(workspaceID, email));
      }

      if (showToast) {
        toast.success('Sent invite');
      }
    } catch (err) {
      toast.error(extractErrorMessages(err));
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
      toast.error(extractErrorMessages(err));
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

      dispatch(trackInvitationCancelled(activeWorkspaceID, email));

      toast.success('Cancelled invite');
    } catch (err) {
      toast.error(extractErrorMessages(err));
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
      toast.error(extractErrorMessages(err));
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
      toast.error(extractErrorMessages(err));
      throw err;
    }
  };

const isVerifiedMember = (member: Realtime.Member): member is Realtime.Member & { creator_id: number } => !!member.creator_id;

export const updateActiveWorkspaceMemberRole =
  (member: Realtime.Member, role: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const numberOfUsedViewerSeats = WorkspaceV2.active.usedViewerSeatsSelector(state);
    const numberOfUsedEditorSeats = WorkspaceV2.active.usedEditorSeatsSelector(state);
    const seatLimits = WorkspaceV2.active.seatLimitsSelector(state);
    const seats = WorkspaceV2.active.numberOfSeatsSelector(state);

    if (role === member.role) {
      return;
    }

    if (!EDITOR_SEAT_ROLES.includes(member.role) && EDITOR_SEAT_ROLES.includes(role) && numberOfUsedEditorSeats >= (seats ?? 1)) {
      toast.error('You have reached your max editor seats usage.');
      return;
    }
    if (role === UserRole.VIEWER && numberOfUsedViewerSeats >= (seatLimits?.viewer ?? 0)) {
      toast.error('You have reached your max viewer seats usage.');
      return;
    }

    if (isVerifiedMember(member)) {
      await dispatch(updateMemberOfActiveWorkspace(member.creator_id, role));
    } else {
      await dispatch(updateInviteToActiveWorkspace(member.email, role));
    }
  };
