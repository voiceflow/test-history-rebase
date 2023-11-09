import type { Utterance } from '@voiceflow/dtos';
import { Language } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (intentID: string, data: Pick<Actions.Utterance.CreateData, 'text'>): Thunk<Utterance> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.Utterance.CreateOne, {
        context: getActiveAssistantContext(state),
        data: {
          ...data,
          language: Language.ENGLISH_US,
          intentID,
        },
      })
    );

    return response.data;
  };

export const createMany =
  (intentID: string, data: Pick<Actions.Utterance.CreateData, 'text'>[]): Thunk<Utterance[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const response = await dispatch(
      waitAsync(Actions.Utterance.CreateMany, {
        context: getActiveAssistantContext(state),
        data: data.map((item) => ({
          ...item,
          language: Language.ENGLISH_US,
          intentID,
        })),
      })
    );

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.Utterance.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.Utterance.PatchOne({ id, patch, context: getActiveAssistantContext(state) }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Actions.Utterance.DeleteOne({ id, context: getActiveAssistantContext(state) }));
  };
