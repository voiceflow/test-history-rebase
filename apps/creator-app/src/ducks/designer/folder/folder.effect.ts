import type { Folder } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

import * as FolderTracking from './folder.tracking';

export const createOne =
  (data: Actions.Folder.CreateData): Thunk<Folder> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Folder.CreateOne, { context, data }));

    dispatch(FolderTracking.created({ id: response.data.id }));

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.Folder.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Folder.PatchOne({ context, id, patch }));
  };

export const patchMany =
  (ids: string[], patch: Actions.Folder.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Folder.PatchMany({ context, ids, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Folder.DeleteOne({ context, id }));

    dispatch(FolderTracking.deleted({ count: 1 }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Folder.DeleteMany({ context, ids }));

    dispatch(FolderTracking.deleted({ count: ids.length }));
  };
