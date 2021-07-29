import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as RealtimeProjectList from '@/ducks/realtimeV2/projectList';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { unique } from '@/utils/array';

import { addProjectToListAction } from '../actions';

export const listNotFoundError = () => Errors.error('List is not found');

// Do not merge with saveProjectListsForWorkspace
// TODO: move saving to the realtime(should be saved on each action) service and remove
export const saveRealtimeProjectListsForWorkspace =
  (workspaceID: string): Thunk =>
  async (_dispatch, _getState, { getRealtimeState }) => {
    const projectLists = RealtimeProjectList.allProjectListsSelector(getRealtimeState());

    if (projectLists.length) {
      await client.projectList.update(workspaceID, projectLists);
    }
  };

export const addProjectToList =
  (listID: string, projectID: string): Thunk =>
  async (dispatch, getState, { getRealtimeState, realtimeDispatch }) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (atomicActionsEnabled) {
      const list = RealtimeProjectList.projectListByIDSelector(getRealtimeState(), { id: listID });

      Errors.assertWorkspaceID(activeWorkspaceID);
      Errors.assert(list, listNotFoundError());

      await realtimeDispatch.sync(
        Realtime.projectList.crudActions.patch({
          key: listID,
          value: { projects: unique([...list.projects, projectID]) },
          workspaceID: activeWorkspaceID,
        })
      );

      await dispatch(saveRealtimeProjectListsForWorkspace(activeWorkspaceID));
    } else {
      dispatch(addProjectToListAction(listID, projectID));
    }
  };
