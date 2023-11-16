import type { Thread } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getLegacyActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (data: Actions.Thread.CreateData): Thunk<Thread> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getLegacyActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Thread.CreateOne, { context, data }));

    return response.data;
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getLegacyActiveAssistantContext(state);

    await dispatch.sync(Actions.Thread.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getLegacyActiveAssistantContext(state);

    await dispatch.sync(Actions.Thread.DeleteMany({ context, ids }));
  };
