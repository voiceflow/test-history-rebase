import type { FunctionVariable } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (
    functionID: string,
    data: Pick<Actions.FunctionVariable.CreateData, 'name' | 'type' | 'description'>
  ): Thunk<FunctionVariable> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.FunctionVariable.CreateOne, {
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
  (id: string, patch: Actions.FunctionVariable.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.FunctionVariable.PatchOne({ id, patch, context: getActiveAssistantContext(state) }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.FunctionVariable.DeleteOne({ id, context: getActiveAssistantContext(state) }));
  };
