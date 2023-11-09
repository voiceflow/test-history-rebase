import type { RequiredEntity } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (data: Actions.RequiredEntity.CreateData): Thunk<RequiredEntity> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.RequiredEntity.CreateOne, {
        context: getActiveAssistantContext(state),
        data,
      })
    );

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.RequiredEntity.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.RequiredEntity.PatchOne({ id, patch, context: getActiveAssistantContext(state) }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.RequiredEntity.DeleteOne({ id, context: getActiveAssistantContext(state) }));
  };
