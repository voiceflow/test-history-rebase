import type { FunctionPath } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (functionID: string, data: Pick<Actions.FunctionPath.CreateData, 'name' | 'label'>): Thunk<FunctionPath> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.FunctionPath.CreateOne, {
        context: getActiveAssistantContext(state),
        data: {
          ...data,
          functionID,
        },
      })
    );

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.FunctionPath.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.FunctionPath.PatchOne({ id, patch, context: getActiveAssistantContext(state) }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.FunctionPath.DeleteOne({ id, context: getActiveAssistantContext(state) }));
  };
