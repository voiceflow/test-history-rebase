import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { EDITOR_SEAT_ROLES } from '@/constants';
import type { State } from '@/ducks';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import type { RealtimeState } from '@/ducks/realtimeV2/index';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Session from '@/ducks/session';
import { trackInvitationCancelled, trackInvitationSent } from '@/ducks/tracking/events/invitation';
import { Member } from '@/models';
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
  async (dispatch, getState, { realtimeDispatch }) => {
    try {
      const members = await client.workspace.findMembers(workspaceID);

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await realtimeDispatch.sync(Realtime.workspace.crudActions.patch({ key: workspaceID, value: { members }, workspaceID }));
      } else {
        dispatch(patchWorkspace(workspaceID, { members }));
      }
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

const getWorkspaceActiveMembers = (state: State, realtimeState: RealtimeState) => {
  const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
  const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

  return atomicActionsEnabled
    ? RealtimeWorkspace.workspaceMembersByIDSelector(realtimeState, { id: activeWorkspaceID })
    : activeWorkspaceMembersSelector(state);
};

export const sendInviteToActiveWorkspace =
  (email: string, permissionType: UserRole | null, showToast = true): Thunk<boolean> =>
  async (dispatch, getState, { getRealtimeState, realtimeDispatch }) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      const currentMembers = getWorkspaceActiveMembers(state, getRealtimeState());
      const newMember = await client.workspace.sendInvite(activeWorkspaceID, email, permissionType || undefined);

      if (newMember) {
        const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

        const updatedMembers = [...currentMembers, newMember];

        if (atomicActionsEnabled) {
          await realtimeDispatch.sync(
            Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: { members: updatedMembers }, workspaceID: activeWorkspaceID })
          );
        } else {
          dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));
        }

        dispatch(trackInvitationSent(activeWorkspaceID, email));
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
  async (dispatch, getState, { getRealtimeState, realtimeDispatch }) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const currentMembers = getWorkspaceActiveMembers(state, getRealtimeState());

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.updateInvite(activeWorkspaceID, email, permissionType);

      const updatedMembers = currentMembers.map((member) => (member.email !== email ? member : { ...member, role: permissionType }));

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await realtimeDispatch.sync(
          Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: { members: updatedMembers }, workspaceID: activeWorkspaceID })
        );
      } else {
        dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));
      }

      toast.success('Updated permissions');
    } catch (err) {
      toast.error(extractErrorMessages(err));
      throw err;
    }
  };

export const cancelInviteToActiveWorkspace =
  (email: string): Thunk =>
  async (dispatch, getState, { getRealtimeState, realtimeDispatch }) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const currentMembers = getWorkspaceActiveMembers(state, getRealtimeState());

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.cancelInvite(activeWorkspaceID, email);
      dispatch(trackInvitationCancelled(activeWorkspaceID, email));

      const updatedMembers = currentMembers.filter((member) => member.email !== email);

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await realtimeDispatch.sync(
          Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: { members: updatedMembers }, workspaceID: activeWorkspaceID })
        );
      } else {
        dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));
      }

      toast.success('Cancelled invite');
    } catch (err) {
      toast.error(extractErrorMessages(err));
      throw err;
    }
  };

export const updateMemberOfActiveWorkspace =
  (creatorID: number, role: UserRole): Thunk =>
  async (dispatch, getState, { getRealtimeState, realtimeDispatch }) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const currentMembers = getWorkspaceActiveMembers(state, getRealtimeState());

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.updateMember(activeWorkspaceID, creatorID, role);

      const updatedMembers = currentMembers.map((member) => (member.creator_id === creatorID ? { ...member, role } : member));

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await realtimeDispatch.sync(
          Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: { members: updatedMembers }, workspaceID: activeWorkspaceID })
        );
      } else {
        dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));
      }
    } catch (err) {
      toast.error(extractErrorMessages(err));
      throw err;
    }
  };

export const deleteMemberOfActiveWorkspace =
  (creatorID: number): Thunk =>
  async (dispatch, getState, { getRealtimeState, realtimeDispatch }) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const currentMembers = getWorkspaceActiveMembers(state, getRealtimeState());

    Errors.assertWorkspaceID(activeWorkspaceID);

    try {
      await client.workspace.deleteMember(activeWorkspaceID, creatorID);

      const updatedMembers = currentMembers.filter((member) => member.creator_id !== creatorID);

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await realtimeDispatch.sync(
          Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: { members: updatedMembers }, workspaceID: activeWorkspaceID })
        );
      } else {
        dispatch(patchWorkspace(activeWorkspaceID, { members: updatedMembers }));
      }
    } catch (err) {
      toast.error(extractErrorMessages(err));
      throw err;
    }
  };

const isVerifiedMember = (member: Member): member is Member & { creator_id: number } => !!member.creator_id;

export const updateActiveWorkspaceMemberRole =
  (member: Member, role: UserRole): Thunk =>
  async (dispatch, getState, { getRealtimeState }) => {
    const state = getState();
    const realtimeState = getRealtimeState();
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    const numberOfUsedViewerSeats = atomicActionsEnabled
      ? RealtimeWorkspace.workspaceUsedViewerSeatsByIDSelector(realtimeState, { id: activeWorkspaceID })
      : usedViewerSeatsSelector(state);

    const numberOfUsedEditorSeats = atomicActionsEnabled
      ? RealtimeWorkspace.workspaceUsedEditorSeatsByIDSelector(realtimeState, { id: activeWorkspaceID })
      : usedEditorSeatsSelector(state);

    const seatLimits = atomicActionsEnabled
      ? RealtimeWorkspace.workspaceSeatLimitsByIDSelector(realtimeState, { id: activeWorkspaceID })
      : seatLimitsSelector(state);

    const seats = atomicActionsEnabled
      ? RealtimeWorkspace.workspaceNumberOfSeatsByIDSelector(realtimeState, { id: activeWorkspaceID })
      : workspaceNumberOfSeatsSelector(state);

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
