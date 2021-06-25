import { toast } from '@voiceflow/ui';
import { batch } from 'react-redux';

import client from '@/client';
import * as Errors from '@/config/errors';
import { EDITOR_SEAT_ROLES, UserRole } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Session from '@/ducks/session';
import { trackInvitationCancelled, trackInvitationSent } from '@/ducks/tracking/events/invitation';
import { Workspace } from '@/models';
import { Thunk } from '@/store/types';

import { patchWorkspace } from '../actions';
import {
  activeWorkspaceMembersSelector,
  seatLimitsSelector,
  usedEditorSeatsSelector,
  usedViewerSeatsSelector,
  workspaceNumberOfSeatsSelector,
} from '../selectors';
import { extractErrorFromResponseData, extractErrorMessages } from '../utils';

export const loadMembers =
  (workspaceID: string): Thunk =>
  async (dispatch) => {
    try {
      const members = await client.workspace.findMembers(workspaceID);
      dispatch(patchWorkspace(workspaceID, { members }));
    } catch (err) {
      toast.error('Unable to retrieve members');
      throw err;
    }
  };

export const acceptInvite =
  (invite: string): Thunk<string | null> =>
  async (dispatch) => {
    try {
      const workspaceID = await client.workspace.acceptInvite(invite);
      dispatch(Session.setActiveWorkspaceID(workspaceID));
      return workspaceID;
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invite Invalid')));
      return null;
    }
  };

export const validateInvite =
  (invite: string): Thunk<boolean> =>
  async () => {
    try {
      return await client.workspace.validateInvite(invite);
    } catch {
      return false;
    }
  };

export const sendInviteToActiveWorkspace =
  (email: string, permissionType: UserRole | null, showToast = true): Thunk<boolean> =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      const currentMembers = activeWorkspaceMembersSelector(state);
      const newMember = await client.workspace.sendInvite(activeWorkspaceID, email, permissionType || undefined);

      if (newMember) {
        batch(() => {
          dispatch(patchWorkspace(activeWorkspaceID, { members: [...currentMembers, newMember] }));
          dispatch(trackInvitationSent(activeWorkspaceID, email));
        });
      }

      if (showToast) {
        toast.success('Sent invite');
      }

      return true;
    } catch (err) {
      toast.error(extractErrorMessages(err));
      throw err;
    }
  };

export const updateInviteToActiveWorkspace =
  (email: string, permissionType: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const currentMembers = activeWorkspaceMembersSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.updateInvite(activeWorkspaceID, email, permissionType);

      const updatedMembers = currentMembers.map((member) => (member.email !== email ? member : { ...member, role: permissionType }));
      dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));

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
    const currentMembers = activeWorkspaceMembersSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.cancelInvite(activeWorkspaceID, email);
      dispatch(trackInvitationCancelled(activeWorkspaceID, email));

      const updatedMembers = currentMembers.filter((member) => member.email !== email);
      dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));

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
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const currentMembers = activeWorkspaceMembersSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.updateMember(activeWorkspaceID, creatorID, role);

      const updatedMembers = currentMembers.map((member) => (member.creator_id === creatorID ? { ...member, role } : member));
      dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));
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
    const currentMembers = activeWorkspaceMembersSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.deleteMember(activeWorkspaceID, creatorID);

      const updatedMembers = currentMembers.filter((member) => member.creator_id !== creatorID);
      dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));
    } catch (err) {
      toast.error(extractErrorMessages(err));
      throw err;
    }
  };

const isVerifiedMember = (member: Workspace.Member): member is Workspace.Member & { creator_id: number } => !!member.creator_id;

export const updateActiveWorkspaceMemberRole =
  (member: Workspace.Member, role: UserRole): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const numberOfUsedEditorSeats = usedEditorSeatsSelector(state);
    const numberOfUsedViewerSeats = usedViewerSeatsSelector(state);
    const seatLimits = seatLimitsSelector(state);
    const seats = workspaceNumberOfSeatsSelector(state);

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
