import { toast } from '@voiceflow/ui';

import client from '@/client';
import projectAdapter from '@/client/adapters/project';
import * as Errors from '@/config/errors';
import { PlatformType } from '@/constants';
import * as Modal from '@/ducks/modal';
import { addProject } from '@/ducks/project/actions';
import { projectByIDSelector } from '@/ducks/project/selectors';
import { addProjectToList } from '@/ducks/projectList/actions';
import { addProjectToDefaultList, saveProjectListsForWorkspace, saveProjectToList } from '@/ducks/projectList/sideEffects';
import { goToDashboard, goToWorkspace } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import { AnyProject, DBWorkspace, Workspace } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { withoutValue } from '@/utils/array';

import { patchWorkspace, removeWorkspace, replaceWorkspaces } from '../actions';
import { allWorkspaceIDsSelector } from '../selectors';
import { extractErrorFromResponseData } from '../utils';

export * from './members';

const MEMBER_UPDATE_ERROR = 'Unable to Update Members';

export const loadWorkspaces =
  (isPublicUser = false): Thunk =>
  async (dispatch) => {
    try {
      const workspaces = await client.workspace.find({
        query: { isPublic: isPublicUser },
      });

      // templates workspace should be last
      const sorted = [...workspaces].sort((l, r) => (l.templates && 1) || (r.templates && -1) || 0).map((workspace) => ({ ...workspace }));

      dispatch(replaceWorkspaces(sorted));
    } catch (err) {
      dispatch(Modal.setError('Unable to fetch workspaces'));

      throw err;
    }
  };

export const createWorkspace =
  (data: { name: string; image?: string }): Thunk<Workspace> =>
  async (dispatch) => {
    try {
      return await client.workspace.createWorkspace(data);
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, 'Unable to create workspace')));

      throw err;
    }
  };

export const removeWorkspaceAndUpdateActive =
  (workspaceID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const workspaceIDs = withoutValue(allWorkspaceIDsSelector(state), workspaceID);

    // default to the first existing workspace
    const newWorkspaceID = workspaceIDs.length > 0 ? workspaceIDs[0] : null;

    if (!newWorkspaceID) {
      dispatch(goToDashboard());
    } else if (newWorkspaceID !== activeWorkspaceID) {
      dispatch(goToWorkspace(newWorkspaceID));
    }

    dispatch(removeWorkspace(workspaceID));
  };

export const deleteWorkspace =
  (workspaceID: string): Thunk =>
  async (dispatch) => {
    try {
      await client.workspace.deleteWorkspace(workspaceID);

      dispatch(removeWorkspaceAndUpdateActive(workspaceID));
      toast.success('Successfully deleted workspace');
    } catch (err) {
      dispatch(Modal.setError(err.body.data || 'Unable to delete workspace'));

      throw err;
    }
  };

export const copyProject =
  (projectID: string, workspaceID: string, listID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const project = projectByIDSelector(state)(projectID);

    if (!project) throw new Error();

    const copiedProject = projectAdapter.fromDB(
      await client.platform(project.platform).project.copy(project.id, { teamID: workspaceID, name: `${project.name} (COPY)` })
    );

    dispatch(addProject(copiedProject.id, copiedProject));

    if (listID) {
      dispatch(addProjectToList(listID, copiedProject.id));
    }
  };

// active workspace

export const loadActiveWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    const workspace = await client.workspace.fetchWorkspace(activeWorkspaceID);

    dispatch(patchWorkspace(activeWorkspaceID, workspace));
  } catch (err) {
    dispatch(Modal.setError('Unable to fetch workspace'));

    throw err;
  }
};

export const leaveActiveWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const store = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(store);

    Errors.assertWorkspaceID(activeWorkspaceID);

    await client.workspace.leaveWorkspace(activeWorkspaceID);

    dispatch(removeWorkspaceAndUpdateActive(activeWorkspaceID));
    toast.success('Successfully left workspace');
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERROR)));

    throw err;
  }
};

export const patchActiveWorkspace =
  (payload: Partial<Workspace>): SyncThunk =>
  (dispatch, getState) => {
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

    Errors.assertWorkspaceID(activeWorkspaceID);

    dispatch(patchWorkspace(activeWorkspaceID, payload));
  };

export const updateActiveWorkspaceMembers =
  (members: DBWorkspace.Member[]): Thunk =>
  async (dispatch, getState) => {
    try {
      const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());
      const body = {
        // switch invite field to email field
        members: members.map((member) => ({ ...member, email: member.invite || member.email })),
      };

      Errors.assertWorkspaceID(activeWorkspaceID);

      const workspace = await client.workspace.updateMembers(activeWorkspaceID, body);

      dispatch(patchActiveWorkspace(workspace));
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERROR)));

      throw err;
    }
  };

export const updateActiveWorkspaceName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

      Errors.assertWorkspaceID(activeWorkspaceID);

      await client.workspace.updateName(activeWorkspaceID, name);

      dispatch(patchWorkspace(activeWorkspaceID, { name }));
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invalid Workspace Name')));

      throw err;
    }
  };

export const updateActiveWorkspaceImage =
  (url: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

      Errors.assertWorkspaceID(activeWorkspaceID);

      await client.workspace.updateImage(activeWorkspaceID, url);

      dispatch(patchWorkspace(activeWorkspaceID, { image: url }));
    } catch (err) {
      dispatch(Modal.setError('Error updating workspace image'));

      throw err;
    }
  };

export const ejectFromActiveWorkspace =
  (workspaceID: string, workspaceName: string): Thunk =>
  async (dispatch, getState) => {
    const currentWorkspaceID = Session.activeWorkspaceIDSelector(getState());

    await dispatch(removeWorkspaceAndUpdateActive(workspaceID));

    if (currentWorkspaceID === workspaceID) {
      dispatch(goToDashboard());
    }

    toast.info(`You are no longer a collaborator for "${workspaceName}" workspace`);
  };

export const saveActiveWorkspaceProjectLists = (): Thunk => async (dispatch, getState) => {
  const workspaceID = Session.activeWorkspaceIDSelector(getState());

  Errors.assertWorkspaceID(workspaceID);

  await dispatch(saveProjectListsForWorkspace(workspaceID));
};

export const importProjectToActiveWorkspace =
  (projectID: string, workspaceID: string): Thunk<AnyProject> =>
  async (dispatch, getState) => {
    const project = await client.api.project.get(projectID);

    const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

    const copiedProject = projectAdapter.fromDB(
      await client.platform(project.platform as PlatformType).project.copy(project._id, { teamID: workspaceID })
    );

    if (activeWorkspaceID === workspaceID) {
      dispatch(addProject(copiedProject.id, copiedProject));
      await dispatch(addProjectToDefaultList(copiedProject.id));
    } else {
      const projectLists = await client.projectList.find(workspaceID);
      dispatch(saveProjectToList(workspaceID, projectLists, copiedProject.id));
    }

    return copiedProject;
  };
