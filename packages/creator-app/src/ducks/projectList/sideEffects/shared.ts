import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { unique } from '@/utils/array';

import { addProjectToListAction } from '../actions';

export const listNotFoundError = () => Errors.error('List is not found');

// Do not merge with saveProjectListsForWorkspace
// TODO: move saving to the realtime(should be saved on each action) service and remove
export const saveRealtimeProjectListsForWorkspace =
  (workspaceID: string): Thunk =>
  async (_dispatch, getState) => {
    const projectLists = ProjectListV2.allProjectListsSelector(getState());

    if (projectLists.length) {
      await client.projectList.update(workspaceID, projectLists);
    }
  };

export const addProjectToList =
  (listID: string, projectID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (atomicActionsEnabled) {
      const list = ProjectListV2.projectListByIDSelector(state, { id: listID });

      Errors.assertWorkspaceID(activeWorkspaceID);
      Errors.assert(list, listNotFoundError());

      await dispatch.sync(
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
