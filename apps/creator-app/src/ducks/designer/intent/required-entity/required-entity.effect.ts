import type { RequiredEntity } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { responseTextVariantCreateDataFactory } from '@/utils/response.util';

export const createOne =
  (data: Pick<Actions.RequiredEntity.CreateData, 'intentID' | 'entityID'>): Thunk<RequiredEntity> =>
  async (dispatch, getState) => {
    const state = getState();

    const requiredEntity = await dispatch(
      waitAsync(Actions.RequiredEntity.CreateOne, {
        data: { ...data, reprompts: [responseTextVariantCreateDataFactory()] },
        context: getActiveAssistantContext(state),
      })
    );

    return requiredEntity.data;
  };

export const createMany =
  (data: Omit<Actions.RequiredEntity.CreateData, 'repromptID'>[]): Thunk<RequiredEntity[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const requiredEntities = await dispatch(
      waitAsync(Actions.RequiredEntity.CreateMany, {
        data: data.map((item) => ({ ...item, reprompts: [responseTextVariantCreateDataFactory()] })),
        context: getActiveAssistantContext(state),
      })
    );

    return requiredEntities.data;
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
