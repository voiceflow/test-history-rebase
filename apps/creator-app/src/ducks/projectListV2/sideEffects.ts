import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { getActiveWorkspaceContext } from '@/ducks/workspaceV2/utils';
import { Thunk } from '@/store/types';

import { projectListByIDSelector } from './selectors';

export const createProjectList =
  (workspaceID?: string, name?: string): Thunk<Realtime.ProjectList> =>
  async (dispatch, getState) => {
    const state = getState();

    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    const id = Utils.id.cuid();
    const list: Realtime.ProjectList = { id, name: name ?? 'New List', projects: [] };

    const targetWorkspaceID = workspaceID || activeWorkspaceID;

    Errors.assertWorkspaceID(targetWorkspaceID);

    await dispatch.sync(Realtime.projectList.crud.add({ workspaceID: targetWorkspaceID, key: id, value: list }));

    return list;
  };

export const renameProjectList =
  (listID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.projectList.crud.patch({ ...getActiveWorkspaceContext(getState()), key: listID, value: { name } }));
  };

export const deleteProjectList =
  (listID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const list = projectListByIDSelector(state, { id: listID });

    Errors.assertProjectList(listID, list);

    await dispatch.sync(Realtime.projectList.crud.remove({ ...getActiveWorkspaceContext(getState()), key: listID }));
  };

export const deleteProjectFromList =
  (listID: string, projectID: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.projectList.removeProjectFromList({ ...getActiveWorkspaceContext(getState()), listID, projectID }));
  };

export const moveProjectList =
  ({ fromID, toIndex, skipPersist }: { fromID: string; toIndex: number; skipPersist?: boolean }): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.projectList.crud.move({ ...getActiveWorkspaceContext(getState()), fromID, toIndex }, { skipPersist }));
  };

export const transplantProjectBetweenLists =
  ({
    toListID,
    fromListID,
    skipPersist,
    fromProjectID,
    toProjectIndex,
  }: {
    toListID: string;
    fromListID: string;
    skipPersist?: boolean;
    fromProjectID: string;
    toProjectIndex: number;
  }): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.projectList.transplantProjectBetweenLists(
        {
          ...getActiveWorkspaceContext(getState()),
          to: { listID: toListID, index: toProjectIndex },
          from: { listID: fromListID, projectID: fromProjectID },
        },
        { skipPersist }
      )
    );
  };
