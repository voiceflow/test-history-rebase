import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import * as Normal from 'normal-store';

import { userIDSelector } from '@/ducks/account/selectors';
import * as Router from '@/ducks/router/actions';
import { getActiveWorkspaceContext } from '@/ducks/workspace/utils';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { SyncThunk, Thunk } from '@/store/types';
import { isEditorUserRole } from '@/utils/role';

import { allEditorMemberIDs, projectByIDSelector } from './selectors';
import { idSelector } from './selectors/active/base';
import { getActiveProjectContext } from './utils';

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

    const numberOfSeats = WorkspaceV2.active.numberOfSeatsSelector(state);
    const projectEditorMemberIDs = allEditorMemberIDs(state);
    const workspaceEditorMemberIDs = WorkspaceV2.active.editorMemberIDsSelector(state);

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
