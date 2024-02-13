import type { Folder } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (data: Actions.Folder.CreateData): Thunk<Folder> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Folder.CreateOne, { context, data }));

    return response.data;
  };

export const createMany =
  (data: Actions.Folder.CreateData[]): Thunk<Folder[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Folder.CreateMany, { context, data }));

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
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Folder.DeleteMany({ context, ids }));
  };
