import type { ResponseCardAttachment, ResponseMediaAttachment } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

interface CreateCardData extends Omit<Actions.ResponseAttachment.CreateCardData, 'variantID'> {}
interface ReplaceCardData extends Omit<Actions.ResponseAttachment.ReplaceCardData, 'variantID'> {}
interface CreateMediaData extends Omit<Actions.ResponseAttachment.CreateMediaData, 'variantID'> {}
interface ReplaceMediaData extends Omit<Actions.ResponseAttachment.ReplaceMediaData, 'variantID'> {}

export const createOneCard =
  (variantID: string, data: CreateCardData): Thunk<ResponseCardAttachment> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseAttachment.CreateCardOne, {
        data: { ...data, variantID },
        context,
      })
    );

    return response.data;
  };

export const replaceOneCard =
  (variantID: string, data: ReplaceCardData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseAttachment.ReplaceOneCard({ ...data, variantID, context }));
  };

export const createOneMedia =
  (variantID: string, data: CreateMediaData): Thunk<ResponseMediaAttachment> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseAttachment.CreateMediaOne, {
        data: { ...data, variantID },
        context,
      })
    );

    return response.data;
  };

export const replaceOneMedia =
  (variantID: string, data: ReplaceMediaData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseAttachment.ReplaceOneMedia({ ...data, variantID, context }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseAttachment.DeleteOne({ id, context }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseAttachment.DeleteMany({ ids, context }));
  };
