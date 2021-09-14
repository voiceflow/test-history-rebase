import { PlatformType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import client from '@/client';
import projectAdapter from '@/client/adapters/project';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import { addProject } from '@/ducks/project/actions';
import { addProjectToDefaultList, addProjectToList, saveProjectListsForWorkspace, saveProjectToList } from '@/ducks/projectList/sideEffects';
import { projectByIDSelector } from '@/ducks/projectV2/selectors';
import { goToDashboard, goToWorkspace } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import { allWorkspaceIDsSelector } from '@/ducks/workspaceV2/selectors';
import { AnyProject, Workspace } from '@/models';
import { Thunk } from '@/store/types';
import { withoutValue } from '@/utils/array';

import { patchWorkspace, removeWorkspace, replaceWorkspaces } from '../actions';
import { extractErrorFromResponseData } from '../utils';

export * from './members';

const MEMBER_UPDATE_ERROR = 'Unable to Update Members';

export const loadWorkspaces =
  (isPublicUser = false): Thunk =>
  async (dispatch, getState) => {
    try {
      const workspaces = await client.workspace.find({
        query: { isPublic: isPublicUser },
      });

      // templates workspace should be last
      const sorted = [...workspaces].sort((l, r) => (l.templates && 1) || (r.templates && -1) || 0).map((workspace) => ({ ...workspace }));

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await dispatch.crossTab(Realtime.workspace.crudLocalActions.replace({ values: sorted }));
      } else {
        dispatch(replaceWorkspaces(sorted));
      }
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
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    const workspaceIDs = withoutValue(allWorkspaceIDsSelector(state), workspaceID);

    // default to the first existing workspace
    const newWorkspaceID = workspaceIDs.length > 0 ? workspaceIDs[0] : null;

    if (!newWorkspaceID) {
      dispatch(goToDashboard());
    } else if (newWorkspaceID !== activeWorkspaceID) {
      dispatch(goToWorkspace(newWorkspaceID));
    }

    if (atomicActionsEnabled) {
      await dispatch.crossTab(Realtime.workspace.crudActions.remove({ key: workspaceID, workspaceID }));
    } else {
      dispatch(removeWorkspace(workspaceID));
    }
  };

export const deleteWorkspace =
  (workspaceID: string): Thunk =>
  async (dispatch) => {
    try {
      await client.workspace.deleteWorkspace(workspaceID);

      await dispatch(removeWorkspaceAndUpdateActive(workspaceID));

      toast.success('Successfully deleted workspace');
    } catch (err) {
      dispatch(Modal.setError(err.body.data || 'Unable to delete workspace'));

      throw err;
    }
  };

export const copyProject =
  (projectID: string, workspaceID: string, listID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const project = projectByIDSelector(state, { id: projectID });

    if (!project) throw new Error();

    // TODO: move to the realtime service
    const copiedProject = projectAdapter.fromDB(
      await client.platform(project.platform).project.copy(project.id, { teamID: workspaceID, name: `${project.name} (COPY)` })
    );

    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

    if (atomicActionsEnabled) {
      await dispatch.sync(
        Realtime.project.crudActions.add({
          key: copiedProject.id,
          value: copiedProject,
          workspaceID,
        })
      );
    } else {
      dispatch(addProject(copiedProject.id, copiedProject));
    }

    if (listID) {
      await dispatch(addProjectToList(listID, copiedProject.id));
    }
  };

// active workspace

export const loadActiveWorkspace = (): Thunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(activeWorkspaceID);

    const workspace = await client.workspace.fetchWorkspace(activeWorkspaceID);

    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

    if (atomicActionsEnabled) {
      await dispatch.crossTab(Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: workspace, workspaceID: activeWorkspaceID }));
    } else {
      dispatch(patchWorkspace(activeWorkspaceID, workspace));
    }
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

    await dispatch(removeWorkspaceAndUpdateActive(activeWorkspaceID));

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
      const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

      Errors.assertWorkspaceID(activeWorkspaceID);

      // TODO: move to the realtime
      await client.workspace.updateName(activeWorkspaceID, name);

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await dispatch.sync(Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: { name }, workspaceID: activeWorkspaceID }));
      } else {
        dispatch(patchWorkspace(activeWorkspaceID, { name }));
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
      const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

      Errors.assertWorkspaceID(activeWorkspaceID);

      // TODO: move to the realtime
      await client.workspace.updateImage(activeWorkspaceID, url);

      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      if (atomicActionsEnabled) {
        await dispatch.sync(Realtime.workspace.crudActions.patch({ key: activeWorkspaceID, value: { image: url }, workspaceID: activeWorkspaceID }));
      } else {
        dispatch(patchWorkspace(activeWorkspaceID, { image: url }));
      }
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

// TODO: remove and save on every action
export const saveActiveWorkspaceProjectLists = (): Thunk => async (dispatch, getState) => {
  const workspaceID = Session.activeWorkspaceIDSelector(getState());

  Errors.assertWorkspaceID(workspaceID);

  await dispatch(saveProjectListsForWorkspace(workspaceID));
};

export const importProjectToActiveWorkspace =
  (projectID: string, workspaceID: string): Thunk<AnyProject> =>
  async (dispatch, getState) => {
    const project = await client.api.project.get(projectID);
    const state = getState();

    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    // TODO: move to realtime service
    const copiedProject = projectAdapter.fromDB(
      await client.platform(project.platform as PlatformType).project.copy(project._id, { teamID: workspaceID })
    );

    if (atomicActionsEnabled) {
      await dispatch.sync(
        Realtime.project.crudActions.add({
          key: copiedProject.id,
          value: copiedProject,
          workspaceID,
        })
      );
    }

    if (activeWorkspaceID === workspaceID) {
      if (!atomicActionsEnabled) {
        dispatch(addProject(copiedProject.id, copiedProject));
      }

      await dispatch(addProjectToDefaultList(copiedProject.id, workspaceID));
    } else {
      const projectLists = await client.projectList.find(workspaceID);

      dispatch(saveProjectToList(workspaceID, projectLists, copiedProject.id));
    }

    return copiedProject;
  };
