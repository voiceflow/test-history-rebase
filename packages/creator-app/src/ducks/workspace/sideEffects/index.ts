import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import { projectByIDSelector } from '@/ducks/projectV2/selectors';
import { goToDashboard, goToWorkspace } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { allWorkspaceIDsSelector } from '@/ducks/workspaceV2/selectors';
import { AnyProject, Workspace } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';

import { crud } from '../actions';
import { extractErrorFromResponseData } from '../utils';

export * from './members';

const MEMBER_UPDATE_ERROR = 'Unable to Update Members';

/**
 * @deprecated these are now loaded automatically by the subscription to the creator/:creatorID realtime event channel
 */
export const loadWorkspaces =
  (isPublicUser = false): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    try {
      const workspaces = await client.workspace.find({ query: { isPublic: isPublicUser } });

      dispatch(crud.replace(workspaces));
    } catch (err) {
      dispatch(Modal.setError('Unable to fetch workspaces'));

      throw err;
    }
  };

export const createWorkspace =
  (data: { name: string; image?: string }): Thunk<Workspace> =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      return dispatch(waitAsync(Realtime.workspace.create, { data })).catch((err) => {
        dispatch(Modal.setError(err || 'Unable to create workspace'));

        throw new Error(err);
      });
    }

    try {
      return await client.workspace.createWorkspace(data);
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, 'Unable to create workspace')));

      throw err;
    }
  };

const navigateToNextWorkspace =
  (workspaceID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    const workspaceIDs = Utils.array.withoutValue(allWorkspaceIDsSelector(state), workspaceID);

    // default to the first existing workspace
    const newWorkspaceID = workspaceIDs.length > 0 ? workspaceIDs[0] : null;

    if (!newWorkspaceID) {
      dispatch(goToDashboard());
    } else if (newWorkspaceID !== activeWorkspaceID) {
      dispatch(goToWorkspace(newWorkspaceID));
    }
  };

const removeWorkspaceAndUpdateActive =
  (workspaceID: string): Thunk =>
  async (dispatch) => {
    dispatch(navigateToNextWorkspace(workspaceID));
    dispatch(crud.remove(workspaceID));
  };

export const deleteWorkspace =
  (workspaceID: string): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

    try {
      if (isAtomicActions) {
        dispatch(navigateToNextWorkspace(workspaceID));
        await dispatch.sync(Realtime.workspace.crud.remove({ key: workspaceID }));
      } else {
        await client.workspace.deleteWorkspace(workspaceID);

        await dispatch(removeWorkspaceAndUpdateActive(workspaceID));
      }

      toast.success('Successfully deleted workspace');
    } catch (err) {
      dispatch(Modal.setError(err.body.data || 'Unable to delete workspace'));

      throw err;
    }
  };

export const duplicateProject =
  (projectID: string, targetWorkspaceID: string, listID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const sourceWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const project = projectByIDSelector(state, { id: projectID });
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertProject(projectID, project);

    if (isAtomicActions) {
      Errors.assertWorkspaceID(sourceWorkspaceID);

      await dispatch.sync(
        Realtime.project.duplicate.started({
          workspaceID: sourceWorkspaceID,
          projectID,
          listID,
          data: { teamID: targetWorkspaceID, name: `${project.name} (COPY)` },
        })
      );

      return;
    }

    const copiedProject = await client
      .platform(project.platform)
      .project.copy(project.id, { teamID: targetWorkspaceID, name: `${project.name} (COPY)` })
      .then(Realtime.Adapters.projectAdapter.fromDB);

    dispatch(Project.crud.add(copiedProject.id, copiedProject));

    if (listID) {
      dispatch(ProjectList.addProjectToList(listID, copiedProject.id));
    }
  };

export const importProject =
  (projectID: string, targetWorkspaceID: string): Thunk<AnyProject> =>
  async (dispatch, getState) => {
    const state = getState();
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    const project = await client.api.project.get(projectID).then(Realtime.Adapters.projectAdapter.fromDB);

    if (isAtomicActions) {
      return dispatch(
        waitAsync(Realtime.project.duplicate, {
          workspaceID: project.workspaceID,
          projectID,
          data: { teamID: targetWorkspaceID },
        })
      );
    }

    const copiedProject = await client
      .platform(project.platform as Constants.PlatformType)
      .project.copy(projectID, { teamID: targetWorkspaceID })
      .then(Realtime.Adapters.projectAdapter.fromDB);

    if (project.workspaceID === targetWorkspaceID) {
      await dispatch(ProjectList.addProjectToDefaultList(copiedProject.id, targetWorkspaceID));
    } else {
      const projectLists = await client.projectList.find(targetWorkspaceID);

      dispatch(ProjectList.saveProjectToList(targetWorkspaceID, projectLists, copiedProject.id));
    }

    return copiedProject;
  };

export const ejectFromWorkspace =
  ({ workspaceID, workspaceName }: Realtime.workspace.member.EjectPayload): Thunk =>
  async (dispatch) => {
    dispatch(navigateToNextWorkspace(workspaceID));
    dispatch.local(Realtime.workspace.crud.remove({ key: workspaceID }));

    toast.info(`You are no longer a collaborator for "${workspaceName}" workspace`);
  };

// active workspace

/**
 * @deprecated no need to re-load the active workspace as updates should be accepted via realtime
 */
export const loadActiveWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    Errors.assertWorkspaceID(activeWorkspaceID);

    const workspace = await client.workspace.fetchWorkspace(activeWorkspaceID);

    dispatch(crud.patch(activeWorkspaceID, workspace));
  } catch (err) {
    dispatch(Modal.setError('Unable to fetch workspace'));

    throw err;
  }
};

export const leaveActiveWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);
    const creatorID = Account.userIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    Errors.assertWorkspaceID(workspaceID);

    if (isAtomicActions) {
      Errors.assertCreatorID(creatorID);

      dispatch(navigateToNextWorkspace(workspaceID));
      dispatch.local(Realtime.workspace.crud.remove({ key: workspaceID }));

      await dispatch.sync(Realtime.workspace.leave({ creatorID, workspaceID }));
    } else {
      await client.workspace.leaveWorkspace(workspaceID);

      await dispatch(removeWorkspaceAndUpdateActive(workspaceID));
    }

    toast.success('Successfully left workspace');
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERROR)));

    throw err;
  }
};

export const updateActiveWorkspaceName =
  (name: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);
      const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

      Errors.assertWorkspaceID(workspaceID);

      if (isAtomicActions) {
        await dispatch.sync(Realtime.workspace.updateName({ workspaceID, name }));
      } else {
        await client.workspace.updateName(workspaceID, name);

        dispatch(crud.patch(workspaceID, { name }));
      }
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invalid Workspace Name')));

      throw err;
    }
  };

export const updateActiveWorkspaceImage =
  (url: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = Session.activeWorkspaceIDSelector(state);
      const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

      Errors.assertWorkspaceID(workspaceID);

      if (isAtomicActions) {
        await dispatch.sync(Realtime.workspace.updateImage({ workspaceID, image: url }));
      } else {
        await client.workspace.updateImage(workspaceID, url);

        dispatch(crud.patch(workspaceID, { image: url }));
      }
    } catch (err) {
      dispatch(Modal.setError('Error updating workspace image'));

      throw err;
    }
  };

/**
 * @deprecated this functionality has moved to the Realtime.workspace.member.removeMember action processor
 */
export const ejectFromActiveWorkspace =
  (workspaceID: string, workspaceName: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const currentWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    await dispatch(removeWorkspaceAndUpdateActive(workspaceID));

    if (currentWorkspaceID === workspaceID) {
      dispatch(goToDashboard());
    }

    toast.info(`You are no longer a collaborator for "${workspaceName}" workspace`);
  };
/**
 * @deprecated no longer required with realtime-enabled project lists
 */
export const saveActiveWorkspaceProjectLists = (): Thunk => async (dispatch, getState) => {
  const workspaceID = Session.activeWorkspaceIDSelector(getState());

  Errors.assertWorkspaceID(workspaceID);

  await dispatch(ProjectList.saveProjectListsForWorkspace(workspaceID));
};
