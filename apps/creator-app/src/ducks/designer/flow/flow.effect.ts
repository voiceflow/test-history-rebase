import type { Flow } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { notify } from '@voiceflow/ui-next';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (data: Actions.Flow.CreateData): Thunk<Flow> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const response = await dispatch(waitAsync(Actions.Flow.CreateOne, { context, data }));

    return response.data;
  };

export const duplicateOne =
  (componentID: string): Thunk<Actions.Flow.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const duplicated = await dispatch(waitAsync(Actions.Flow.DuplicateOne, { context, data: { flowID: componentID } }));

    notify.short.success('Duplicated');

    return duplicated.data;
  };

export const patchOne =
  (id: string, patch: Actions.Flow.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Flow.PatchOne({ context, id, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Flow.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Flow.DeleteMany({ context, ids }));
  };
