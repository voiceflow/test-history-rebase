import type { Intent, IntentClassificationSettings } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { generalRuntimeClient } from '@/client/general-runtime/general-runtime.client';
import type { GeneralRuntimeIntentPreviewUtteranceResponse } from '@/client/general-runtime/general-runtime.interface';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (data: Actions.Intent.CreateData): Thunk<Intent> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Intent.CreateOne, { context, data }));

    return response.data;
  };

export const createMany =
  (data: Actions.Intent.CreateData[]): Thunk<Intent[]> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Intent.CreateMany, { context, data }));

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.Intent.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Intent.PatchOne({ context, id, patch }));
  };

export const patchMany =
  (ids: string[], patch: Actions.Intent.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Intent.PatchMany({ context, ids, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Intent.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Intent.DeleteMany({ context, ids }));
  };

export const previewUtterance =
  (utterance: string, settings: IntentClassificationSettings): Thunk<GeneralRuntimeIntentPreviewUtteranceResponse> =>
  async (_, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    Errors.assertWorkspaceID(workspaceID);

    return generalRuntimeClient.intent.previewUtterance(workspaceID, {
      utterance,
      projectID: context.assistantID,
      versionID: context.environmentID,
      intentClassificationSettings: settings,
    });
  };
