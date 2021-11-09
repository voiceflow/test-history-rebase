import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { EDITOR_SEAT_ROLES } from '@/constants';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import * as Session from '@/ducks/session';
import { trackInvitationCancelled, trackInvitationSent } from '@/ducks/tracking/events/invitation';
import { waitAsync } from '@/ducks/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { Thunk } from '@/store/types';

import { crud } from '../actions';
import { extractErrorFromResponseData, extractErrorMessages } from '../utils';

/**
 * @deprecated workspace member state is kept up to date by subscription to the workspace channel
 */
export const loadMembers =
  (workspaceID: string): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    try {
      const members = await client.workspace.findMembers(workspaceID);

      dispatch(crud.patch(workspaceID, { members }));
    } catch (err) {
      toast.error('Unable to retrieve members');
      throw err;
    }
  };

export const acceptInvite =
  (invite: string): Thunk<string | null> =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

    try {
      const workspaceID = await (isAtomicActions
        ? dispatch(waitAsync(Realtime.workspace.member.acceptInvite, { invite }))
        : client.workspace.acceptInvite(invite));

      dispatch(Session.setActiveWorkspaceID(workspaceID));

      return workspaceID;
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invite Invalid')));
      return null;
    }
  };

export const sendInviteToActiveWorkspace =
  (email: string, role: UserRole | null, showToast = true): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertWorkspaceID(workspaceID);

    try {
      if (isAtomicActions) {
        const newMember = await dispatch(waitAsync(Realtime.workspace.member.sendInvite, { workspaceID, email, role: role ?? undefined }));

        if (newMember) {
          dispatch(trackInvitationSent(workspaceID, email));
        }
      } else {
        const currentMembers = WorkspaceV2.active.membersSelector(state);
        const newMember = await client.workspace.sendInvite(workspaceID, email, role || undefined);

        if (newMember) {
          const updatedMembers = [...currentMembers, newMember];

          dispatch(crud.patch(workspaceID, { members: updatedMembers }));
          dispatch(trackInvitationSent(workspaceID, email));
        }
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
    const currentMembers = WorkspaceV2.active.membersSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      if (isAtomicActions) {
        await dispatch.sync(Realtime.workspace.member.updateInvite({ workspaceID: activeWorkspaceID, email, role }));
      } else {
        await client.workspace.updateInvite(activeWorkspaceID, email, role);

        const updatedMembers = currentMembers.map((member) => (member.email !== email ? member : { ...member, role }));

        dispatch(crud.patch(activeWorkspaceID, { members: updatedMembers }));
      }

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
    const currentMembers = WorkspaceV2.active.membersSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      if (isAtomicActions) {
        await dispatch.sync(Realtime.workspace.member.cancelInvite({ workspaceID: activeWorkspaceID, email }));
      } else {
        await client.workspace.cancelInvite(activeWorkspaceID, email);
      }

      dispatch(trackInvitationCancelled(activeWorkspaceID, email));

      if (!isAtomicActions) {
        const updatedMembers = currentMembers.filter((member) => member.email !== email);

        dispatch(crud.patch(activeWorkspaceID, { members: updatedMembers }));
      }

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
    const currentMembers = WorkspaceV2.active.membersSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertWorkspaceID(workspaceID);

    try {
      if (isAtomicActions) {
        await dispatch.sync(Realtime.workspace.member.patch({ workspaceID, creatorID, member: { role } }));
      } else {
        const updatedMembers = currentMembers.map((member) => (member.creator_id === creatorID ? { ...member, role } : member));

        await client.workspace.updateMember(workspaceID, creatorID, role);
        dispatch(crud.patch(workspaceID, { members: updatedMembers }));
      }
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
    const currentMembers = WorkspaceV2.active.membersSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      if (isAtomicActions) {
        await dispatch.sync(Realtime.workspace.member.remove({ workspaceID: activeWorkspaceID, creatorID }));
      } else {
        await client.workspace.deleteMember(activeWorkspaceID, creatorID);

        const updatedMembers = currentMembers.filter((member) => member.creator_id !== creatorID);
        dispatch(crud.patch(activeWorkspaceID, { members: updatedMembers }));
      }
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
