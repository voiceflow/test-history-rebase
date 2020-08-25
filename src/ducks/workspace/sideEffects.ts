import client from '@/client';
import { toast } from '@/components/Toast';
import { PlatformType, UserRole } from '@/constants';
import { deleteNormalize, normalize } from '@/ducks/_normalize';
import * as Modal from '@/ducks/modal';
import * as ProjectList from '@/ducks/projectList';
import { goToDashboard } from '@/ducks/router/actions';
import * as Template from '@/ducks/template';
import * as Tracking from '@/ducks/tracking';
import { DBProject, DBWorkspace, Workspace } from '@/models';
import { ActionPayload, SyncThunk, Thunk } from '@/store/types';

import { UpdateWorkspaces, updateCurrentWorkspace, updateWorkspace, updateWorkspaces } from './actions';
import { NoValidTemplateError } from './constants';
import { activeWorkspaceIDSelector, activeWorkspaceMembersSelector } from './selectors';
import { extractErrorFromResponseData, extractErrorMessages, log } from './utils';

const MEMBER_UPDATE_ERROR = 'Unable to Update Members';

export const updateCurrentWorkspaceItem = (payload: Partial<Workspace>): SyncThunk => (dispatch, getState) => {
  const workspaceID = activeWorkspaceIDSelector(getState());

  if (workspaceID) {
    dispatch(updateWorkspace(workspaceID, payload));
  }
};

export const removeWorkspace = (workspaceID: string): Thunk => async (dispatch, getState) => {
  const workspaces = getState().workspace;
  const state = deleteNormalize(workspaceID, workspaces);
  // default to the first existing team
  const newWorkspace = state.allIds.length > 0 ? state.allIds[0] : undefined;

  dispatch(updateCurrentWorkspace(newWorkspace));
  dispatch(updateWorkspaces(state));
};

export const deleteWorkspace = (workspaceID: string): Thunk => async (dispatch) => {
  try {
    await client.workspace.deleteWorkspace(workspaceID);

    dispatch(removeWorkspace(workspaceID));
    toast.success('Successfully deleted workspace');
  } catch (err) {
    dispatch(Modal.setError(err.body.data || 'Unable to delete workspace'));

    throw err;
  }
};

export const fetchWorkspaces = (): SyncThunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = activeWorkspaceIDSelector(state)!;

    const workspaces = await client.workspace.find();

    // NORMALIZE TEAMS
    const normalizedWorkspaces = normalize(
      'id',
      workspaces.sort((l, r) => (l.templates && 1) || (r.templates && -1) || 0).map((workspace) => ({ ...workspace }))
    ) as ActionPayload<UpdateWorkspaces>;

    // If the current team doesn't exist, default it to something else
    dispatch(updateWorkspaces(normalizedWorkspaces));

    if (!normalizedWorkspaces.byId.hasOwnProperty(activeWorkspaceID)) {
      dispatch(updateCurrentWorkspace(workspaces[0]?.id));
    }

    return normalizedWorkspaces;
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

    dispatch(removeWorkspace(targetWorkspaceID));
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

    const [workspace] = await client.workspace.fetchWorkspace(activeWorkspaceID);

    dispatch(updateWorkspace(activeWorkspaceID, workspace));
  } catch (err) {
    dispatch(Modal.setError('Unable to fetch workspace'));

    throw err;
  }
};

export const createWorkspace = (data: { name: string; image?: string }): Thunk<Workspace> => async (dispatch) => {
  try {
    return client.workspace.createWorkspace(data);
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERROR)));

    throw err;
  }
};

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

    dispatch(updateWorkspace(activeWorkspaceID, { name }));
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invalid Workspace Name')));

    throw err;
  }
};

export const updateWorkspaceImage = (url: string): Thunk => async (dispatch, getState) => {
  try {
    const activeWorkspaceID = activeWorkspaceIDSelector(getState())!;

    await client.workspace.updateImage(activeWorkspaceID, url);

    dispatch(updateWorkspace(activeWorkspaceID, { image: url }));
  } catch (err) {
    dispatch(Modal.setError('Error updating workspace image'));

    throw err;
  }
};

export const validateInvite = (invite: string): Thunk<string | null> => async (dispatch) => {
  try {
    const workspaceID = await client.workspace.validateInvite(invite);
    dispatch(updateCurrentWorkspace(workspaceID));
    return workspaceID;
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invite Invalid')));
    return null;
  }
};

// /////////////////////////
// New workspace actions  //
// /////////////////////////

export const sendInvite = (email: string, permissionType: UserRole, showToast = true): Thunk<boolean> => async (dispatch, getState) => {
  const state = getState();
  try {
    const currentWorkspaceID = activeWorkspaceIDSelector(state)!;
    const currentMembers = activeWorkspaceMembersSelector(state);
    const newMember = await client.workspace.sendInvite(currentWorkspaceID, email, permissionType || undefined);

    if (newMember) {
      dispatch(updateWorkspace(currentWorkspaceID, { members: [...currentMembers, newMember] }));
      dispatch(Tracking.trackInvitationSent(currentWorkspaceID, email));
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
    dispatch(updateWorkspace(currentWorkspaceID, { members: updatedMembers }));

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
    dispatch(Tracking.trackInvitationCancelled(workspaceID, email));

    const updatedMembers = currentMembers.filter((member) => member.email !== email);
    dispatch(updateWorkspace(workspaceID, { members: updatedMembers }));

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
    dispatch(updateWorkspace(workspaceID, { members: updatedMembers }));
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
    dispatch(updateWorkspace(workspaceID, { members: updatedMembers }));
  } catch (err) {
    toast.error(extractErrorMessages(err));
    throw err;
  }
};

export const getMembers = (workspaceID: string): Thunk => async (dispatch) => {
  try {
    const members = await client.workspace.findMembers(workspaceID);
    dispatch(updateWorkspace(workspaceID, { members }));
  } catch (err) {
    toast.error('Unable to retrieve members');
    throw err;
  }
};

export interface NewProjectOptions {
  name: string;
  locales: string[];
  platform: PlatformType;
}

export const createProject = (workspaceID: string, project: NewProjectOptions, templateIndex = 0): Thunk<DBProject> => async (dispatch, getState) => {
  await dispatch(Template.loadTemplates());
  const templates = Template.allTemplatesSelector(getState());
  const templateID = templates[templateIndex]?.id;

  // onboarding failsafe
  if (!templateID) {
    throw new NoValidTemplateError();
  }

  try {
    const createdProject = await client.workspace.createProjectFromModule(workspaceID, templateID, project);

    if (createdProject.skill_id && createdProject.diagram) {
      return createdProject;
    }

    throw new Error('Invalid Response Format');
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const ejectFromWorkspace = (workspaceID: string, workspaceName: string): Thunk => async (dispatch, getState) => {
  const currentWorkspaceID = activeWorkspaceIDSelector(getState());

  await dispatch(removeWorkspace(workspaceID));

  if (currentWorkspaceID === workspaceID) {
    dispatch(goToDashboard());
  }

  toast.info(`You are no longer a collaborator for "${workspaceName}" workspace`);
};

export const saveActiveWorkspaceProjectLists = (): Thunk => async (dispatch, getState) => {
  const workspaceID = activeWorkspaceIDSelector(getState());

  if (!workspaceID) return;

  await dispatch(ProjectList.saveProjectListsForWorkspace(workspaceID));
};
