import type { Story } from '@voiceflow/sdk-logux-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (data: Actions.Story.CreateData): Thunk<Story> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Story.CreateOne, { context, data }));

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.Story.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Story.PatchOne({ context, id, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Story.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Story.DeleteMany({ context, ids }));
  };
