import type { AnyResponseVariant, JSONResponseVariant, PromptResponseVariant, TextResponseVariant } from '@voiceflow/sdk-logux-designer';
import { Actions, CardLayout, ResponseContext, ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import { match } from 'ts-pattern';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { markupFactory } from '@/utils/markup.util';

interface CreateTextData extends Partial<Omit<Actions.ResponseVariant.CreateTextData, 'discriminatorID'>> {}

interface CreateJSONData extends Partial<Omit<Actions.ResponseVariant.CreateJSONData, 'discriminatorID'>> {}

interface CreatePromptData extends Partial<Omit<Actions.ResponseVariant.CreatePromptData, 'discriminatorID'>> {}

const textCreateDataFactory =
  (discriminatorID: string) =>
  ({
    text = markupFactory(),
    speed = null,
    cardLayout = CardLayout.CAROUSEL,
    conditionID = null,
    attachmentOrder = [],
  }: Partial<CreateTextData>): Actions.ResponseVariant.CreateTextData => ({
    text,
    speed,
    cardLayout,
    conditionID,
    attachmentOrder,
    discriminatorID,
  });

const jsonCreateDataFactory =
  (discriminatorID: string) =>
  ({ json = markupFactory(), conditionID = null, attachmentOrder = [] }: Partial<CreateJSONData>): Actions.ResponseVariant.CreateJSONData => ({
    json,
    conditionID,
    attachmentOrder,
    discriminatorID,
  });

const promptCreateDataFactory =
  (discriminatorID: string) =>
  ({
    turns = 1,
    context = ResponseContext.PROMPT,
    promptID = null,
    conditionID = null,
    attachmentOrder = [],
  }: Partial<CreatePromptData>): Actions.ResponseVariant.CreatePromptData => ({
    turns,
    context,
    promptID,
    conditionID,
    attachmentOrder,
    discriminatorID,
  });

export const createOneText =
  (discriminatorID: string, data: CreateTextData = {}): Thunk<TextResponseVariant> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreateTextOne, {
        data: textCreateDataFactory(discriminatorID)(data),
        context,
      })
    );

    return response.data;
  };

export const createManyText =
  (discriminatorID: string, data: CreateTextData[]): Thunk<TextResponseVariant[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreateTextMany, {
        data: data.map(textCreateDataFactory(discriminatorID)),
        context,
      })
    );

    return response.data;
  };

export const createOneJSON =
  (discriminatorID: string, data: CreateJSONData = {}): Thunk<JSONResponseVariant> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreateJSONOne, { context, data: jsonCreateDataFactory(discriminatorID)(data) })
    );

    return response.data;
  };

export const createOnePrompt =
  (discriminatorID: string, data: CreatePromptData = {}): Thunk<PromptResponseVariant> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreatePromptOne, {
        data: promptCreateDataFactory(discriminatorID)(data),
        context,
      })
    );

    return response.data;
  };

export const createManyPrompt =
  (discriminatorID: string, data: CreatePromptData[]): Thunk<PromptResponseVariant[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(
      waitAsync(Actions.ResponseVariant.CreatePromptMany, {
        data: data.map(promptCreateDataFactory(discriminatorID)),
        context,
      })
    );

    return response.data;
  };

export const createOneEmpty =
  (discriminatorID: string, variantType: ResponseVariantType): Thunk<AnyResponseVariant> =>
  (dispatch) =>
    match(variantType)
      .with(ResponseVariantType.TEXT, () => dispatch(createOneText(discriminatorID)))
      .with(ResponseVariantType.JSON, () => dispatch(createOneJSON(discriminatorID)))
      .with(ResponseVariantType.PROMPT, () => dispatch(createOnePrompt(discriminatorID)))
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
