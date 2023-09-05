import type { IntentTrigger } from '@voiceflow/sdk-logux-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOneIntent =
  (data: Actions.Trigger.CreateIntentData): Thunk<IntentTrigger> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Trigger.CreateOneIntent, { context, data }));

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.Trigger.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Trigger.PatchOne({ context, id, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Trigger.DeleteOne({ context, id }));
  };
