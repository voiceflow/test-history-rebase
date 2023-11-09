import type { EntityVariant } from '@voiceflow/dtos';
import { Language } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (entityID: string, data: Pick<Actions.EntityVariant.CreateData, 'value' | 'synonyms'>): Thunk<EntityVariant> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.EntityVariant.CreateOne, {
        context: getActiveAssistantContext(state),
        data: {
          ...data,
          language: Language.ENGLISH_US,
          entityID,
        },
      })
    );

    return response.data;
  };

export const createMany =
  (entityID: string, data: Pick<Actions.EntityVariant.CreateData, 'value' | 'synonyms'>[]): Thunk<EntityVariant[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.EntityVariant.CreateMany, {
        context: getActiveAssistantContext(state),
        data: data.map((item) => ({
          ...item,
          language: Language.ENGLISH_US,
          entityID,
        })),
      })
    );

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.EntityVariant.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.EntityVariant.PatchOne({ id, patch, context: getActiveAssistantContext(state) }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.EntityVariant.DeleteOne({ id, context: getActiveAssistantContext(state) }));
  };
