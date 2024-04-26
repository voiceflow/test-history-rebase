import type { AnyResponseVariant, JSONResponseVariant, TextResponseVariant } from '@voiceflow/dtos';
import { ResponseVariantType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { responseJSONVariantCreateDataFactory, responseTextVariantCreateDataFactory } from '@/utils/response.util';

interface CreateTextData extends Partial<Omit<Actions.ResponseVariant.CreateTextData, 'discriminatorID'>> {}

interface CreateJSONData extends Partial<Omit<Actions.ResponseVariant.CreateJSONData, 'discriminatorID'>> {}

export const createOneText =
  (
    discriminatorID: string,
    data?: CreateTextData,
    options?: Actions.ResponseVariant.CreateOptions
  ): Thunk<TextResponseVariant> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreateTextOne, {
        data: { ...responseTextVariantCreateDataFactory(data), discriminatorID },
        options,
        context,
      })
    );

    return response.data;
  };

export const createManyText =
  (
    discriminatorID: string,
    data: CreateTextData[],
    options?: Actions.ResponseVariant.CreateOptions
  ): Thunk<TextResponseVariant[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreateTextMany, {
        data: data.map((item) => ({ ...responseTextVariantCreateDataFactory(item), discriminatorID })),
        context,
        options,
      })
    );

    return response.data;
  };

export const createOneJSON =
  (
    discriminatorID: string,
    data?: CreateJSONData,
    options?: Actions.ResponseVariant.CreateOptions
  ): Thunk<JSONResponseVariant> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreateJSONOne, {
        context,
        data: { ...responseJSONVariantCreateDataFactory(data), discriminatorID },
        options,
      })
    );

    return response.data;
  };

export const createOneEmpty =
  (
    discriminatorID: string,
    variantType: ResponseVariantType,
    options?: Actions.ResponseVariant.CreateOptions
  ): Thunk<AnyResponseVariant> =>
  (dispatch) =>
    match(variantType)
      .with(ResponseVariantType.TEXT, () => dispatch(createOneText(discriminatorID, undefined, options)))
      .with(ResponseVariantType.JSON, () => dispatch(createOneJSON(discriminatorID, undefined, options)))
      .with(ResponseVariantType.PROMPT, () => {
        throw new Error('Not implemented');
      })
      .exhaustive();

export const patchOneText =
  (id: string, patch: Actions.ResponseVariant.PatchTextData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseVariant.PatchOneText({ id, patch, context }));
  };

export const patchOnePrompt =
  (id: string, patch: Actions.ResponseVariant.PatchPromptData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseVariant.PatchOnePrompt({ id, patch, context }));
  };

export const replaceWithType =
  (id: string, type: ResponseVariantType): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseVariant.ReplaceWithType({ id, type, context }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.ResponseVariant.DeleteOne({ context, id }));
  };
