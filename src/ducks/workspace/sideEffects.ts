import client from '@/client';
import { toast } from '@/components/Toast';
import { PlatformType, UserRole } from '@/constants';
import * as Modal from '@/ducks/modal';
import { saveProjectListsForWorkspace } from '@/ducks/projectList/sideEffects';
import { goToDashboard, goToWorkspace } from '@/ducks/router/actions';
import { activeWorkspaceIDSelector, setActiveWorkspaceID } from '@/ducks/session';
import { trackInvitationCancelled, trackInvitationSent } from '@/ducks/tracking/events/invitation';
import * as CRUD from '@/ducks/utils/crud';
import { DBWorkspace, Workspace } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { withoutValue } from '@/utils/array';
import { normalize } from '@/utils/normalized';

import { patchWorkspace } from './actions';
import { STATE_KEY } from './constants';
import { activeWorkspaceMembersSelector, allWorkspaceIDsSelector } from './selectors';
import { extractErrorFromResponseData, extractErrorMessages } from './utils';

const MEMBER_UPDATE_ERROR = 'Unable to Update Members';

const crud = CRUD.createCRUDActionCreators(STATE_KEY);

export const updateCurrentWorkspaceItem = (payload: Partial<Workspace>): SyncThunk => (dispatch, getState) => {
  const workspaceID = activeWorkspaceIDSelector(getState());

  if (workspaceID) {
    dispatch(patchWorkspace(workspaceID, payload));
  }
};

export const removeWorkspaceAndUpdateActive = (workspaceID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const activeWorkspaceID = activeWorkspaceIDSelector(state);
  const workspaceIDs = withoutValue(allWorkspaceIDsSelector(state), workspaceID);

  // default to the first existing team
  const newWorkspaceID = workspaceIDs.length > 0 ? workspaceIDs[0] : null;

  if (!newWorkspaceID) {
    dispatch(goToDashboard());
  } else if (newWorkspaceID !== activeWorkspaceID) {
    dispatch(goToWorkspace(newWorkspaceID));
  }

  dispatch(crud.remove(workspaceID));
};

export const deleteWorkspace = (workspaceID: string): Thunk => async (dispatch) => {
  try {
    await client.workspace.deleteWorkspace(workspaceID);

    dispatch(removeWorkspaceAndUpdateActive(workspaceID));
    toast.success('Successfully deleted workspace');
  } catch (err) {
    dispatch(Modal.setError(err.body.data || 'Unable to delete workspace'));

    throw err;
  }
};

export const fetchWorkspaces = (isPublicUser = false): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = activeWorkspaceIDSelector(state)!;

    const workspaces = await client.workspace.find({
      query: { isPublic: isPublicUser },
    });
    const sorted = workspaces.sort((l, r) => (l.templates && 1) || (r.templates && -1) || 0).map((workspace) => ({ ...workspace }));
    const normalized = normalize(sorted);

    // If the current team doesn't exist, default it to something else
    dispatch(crud.replace(workspaces.sort((l, r) => (l.templates && 1) || (r.templates && -1) || 0).map((workspace) => ({ ...workspace }))));

    if (!normalized.allKeys.includes(activeWorkspaceID)) {
      dispatch(setActiveWorkspaceID(workspaces[0]?.id ?? null));
    }
  } catch (err) {
    dispatch(Modal.setError('Unable to fetch workspaces'));

    throw err;
  }
};

export const leaveWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const store = getState();
    const targetWorkspaceID = activeWorkspaceIDSelector(store)!;
    await client.workspace.leaveWorkspace(targetWorkspaceID);

    dispatch(removeWorkspaceAndUpdateActive(targetWorkspaceID));
    toast.success('Successfully left workspace');
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERROR)));

    throw err;
  }
};

export const fetchWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = activeWorkspaceIDSelector(state)!;

    const workspace = await client.workspace.fetchWorkspace(activeWorkspaceID);

    dispatch(patchWorkspace(activeWorkspaceID, workspace));
  } catch (err) {
    dispatch(Modal.setError('Unable to fetch workspace'));

    throw err;
  }
};

export const createWorkspace = (data: { name: string; image?: string }): Thunk<Workspace> => async () => client.workspace.createWorkspace(data);

export const updateMembers = (members: DBWorkspace.Member[]): Thunk => async (dispatch, getState) => {
  try {
    const activeWorkspaceID = activeWorkspaceIDSelector(getState())!;
    const body = {
      // switch invite field to email field
      members: members.map((member) => ({ ...member, email: member.invite || member.email })),
    };

    const workspace = await client.workspace.updateMembers(activeWorkspaceID, body);

    dispatch(updateCurrentWorkspaceItem(workspace));
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERROR)));

    throw err;
  }
};

export const updateWorkspaceName = (name: string): Thunk => async (dispatch, getState) => {
  try {
    const activeWorkspaceID = activeWorkspaceIDSelector(getState())!;

    await client.workspace.updateName(activeWorkspaceID, name);

    dispatch(patchWorkspace(activeWorkspaceID, { name }));
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invalid Workspace Name')));

    throw err;
  }
};

export const updateWorkspaceImage = (url: string): Thunk => async (dispatch, getState) => {
  try {
    const activeWorkspaceID = activeWorkspaceIDSelector(getState())!;

    await client.workspace.updateImage(activeWorkspaceID, url);

    dispatch(patchWorkspace(activeWorkspaceID, { image: url }));
  } catch (err) {
    dispatch(Modal.setError('Error updating workspace image'));

    throw err;
  }
};

export const acceptInvite = (invite: string): Thunk<string | null> => async (dispatch) => {
  try {
    const workspaceID = await client.workspace.acceptInvite(invite);
    dispatch(setActiveWorkspaceID(workspaceID));
    return workspaceID;
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invite Invalid')));
    return null;
  }
};

export const validateInvite = (invite: string): Thunk<boolean> => async () => {
  try {
    return await client.workspace.validateInvite(invite);
  } catch {
    return false;
  }
};

export const sendInvite = (email: string, permissionType: UserRole, showToast = true): Thunk<boolean> => async (dispatch, getState) => {
  const state = getState();
  try {
    const currentWorkspaceID = activeWorkspaceIDSelector(state)!;
    const currentMembers = activeWorkspaceMembersSelector(state);
    const newMember = await client.workspace.sendInvite(currentWorkspaceID, email, permissionType || undefined);

    if (newMember) {
      dispatch(patchWorkspace(currentWorkspaceID, { members: [...currentMembers, newMember] }));
      dispatch(trackInvitationSent(currentWorkspaceID, email));
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

export const updateInvite = (email: string, permissionType: UserRole): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const currentWorkspaceID = activeWorkspaceIDSelector(state)!;
    const currentMembers = activeWorkspaceMembersSelector(state);

    await client.workspace.updateInvite(currentWorkspaceID, email, permissionType);

    const updatedMembers = currentMembers.map((member) => (member.email !== email ? member : { ...member, role: permissionType }));
    dispatch(patchWorkspace(currentWorkspaceID, { members: updatedMembers }));

    toast.success('Updated permissions');
  } catch (err) {
    toast.error(extractErrorMessages(err));
    throw err;
  }
};

export const cancelInvite = (email: string): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const workspaceID = activeWorkspaceIDSelector(state)!;
    const currentMembers = activeWorkspaceMembersSelector(state);

    await client.workspace.cancelInvite(workspaceID, email);
    dispatch(trackInvitationCancelled(workspaceID, email));

    const updatedMembers = currentMembers.filter((member) => member.email !== email);
    dispatch(patchWorkspace(workspaceID, { members: updatedMembers }));

    toast.success('Cancelled invite');
  } catch (err) {
    toast.error(extractErrorMessages(err));
    throw err;
  }
};

export const updateMember = (creatorID: number, role: UserRole): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const workspaceID = activeWorkspaceIDSelector(state)!;
    const currentMembers = activeWorkspaceMembersSelector(state);

    await client.workspace.updateMember(workspaceID, creatorID, role);

    const updatedMembers = currentMembers.map((member) => (member.creator_id === creatorID ? { ...member, role } : member));
    dispatch(patchWorkspace(workspaceID, { members: updatedMembers }));
  } catch (err) {
    toast.error(extractErrorMessages(err));
    throw err;
  }
};

export const deleteMember = (creatorID: number): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const workspaceID = activeWorkspaceIDSelector(state)!;
    const currentMembers = activeWorkspaceMembersSelector(state);

    await client.workspace.deleteMember(workspaceID, creatorID);

    const updatedMembers = currentMembers.filter((member) => member.creator_id !== creatorID);
    dispatch(patchWorkspace(workspaceID, { members: updatedMembers }));
  } catch (err) {
    toast.error(extractErrorMessages(err));
    throw err;
  }
};

export const getMembers = (workspaceID: string): Thunk => async (dispatch) => {
  try {
    const members = await client.workspace.findMembers(workspaceID);
    dispatch(patchWorkspace(workspaceID, { members }));
  } catch (err) {
    toast.error('Unable to retrieve members');
    throw err;
  }
};

export interface NewProjectOptions {
  name: string;
  locales: string[];
  platform: PlatformType;
  mainLocale?: string;
  inv_name?: string;
  largeIcon?: string;
  smallIcon?: string;
}

export const ejectFromWorkspace = (workspaceID: string, workspaceName: string): Thunk => async (dispatch, getState) => {
  const currentWorkspaceID = activeWorkspaceIDSelector(getState());

  await dispatch(removeWorkspaceAndUpdateActive(workspaceID));

  if (currentWorkspaceID === workspaceID) {
    dispatch(goToDashboard());
  }

  toast.info(`You are no longer a collaborator for "${workspaceName}" workspace`);
};

export const saveActiveWorkspaceProjectLists = (): Thunk => async (dispatch, getState) => {
  const workspaceID = activeWorkspaceIDSelector(getState());

  if (!workspaceID) return;

  await dispatch(saveProjectListsForWorkspace(workspaceID));
};
