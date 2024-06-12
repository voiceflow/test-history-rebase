import type { ResponseMessage } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { responseMessageCreateDataFactory } from '@/utils/response.util';

interface CreateData extends Partial<Omit<Actions.ResponseMessage.CreateData, 'discriminatorID'>> {}

export const createOne =
  (
    discriminatorID: string,
    data?: CreateData,
    options?: Actions.ResponseMessage.CreateOptions
  ): Thunk<ResponseMessage> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseMessage.CreateOne, {
        data: { ...responseMessageCreateDataFactory(data), discriminatorID },
        options,
        context,
      })
    );

    return response.data;
  };

export const createMany =
  (
    discriminatorID: string,
    data: CreateData[],
    options?: Actions.ResponseMessage.CreateOptions
  ): Thunk<ResponseMessage[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseMessage.CreateMany, {
        data: data.map((item) => ({ ...responseMessageCreateDataFactory(item), discriminatorID })),
        context,
        options,
      })
    );

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.ResponseMessage.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseMessage.PatchOne({ id, patch, context }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseMessage.DeleteOne({ context, id }));
  };
