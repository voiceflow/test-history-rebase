import type { Response } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { notify } from '@voiceflow/ui-next';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

export const createOne =
  (data: Actions.Response.CreateData): Thunk<Response> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Response.CreateOne, { context, data }));

    return response.data;
  };

export const duplicateOne =
  (responseID: string): Thunk<Actions.Response.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const duplicated = await dispatch(waitAsync(Actions.Response.DuplicateOne, { context, data: { responseID } }));

    notify.short.success('Duplicated');

    return duplicated.data;
  };

export const patchOne =
  (id: string, patch: Actions.Response.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Response.PatchOne({ id, patch, context }));
  };

export const patchMany =
  (ids: string[], patch: Actions.Response.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Response.PatchMany({ context, ids, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Response.DeleteOne({ id, context }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Response.DeleteMany({ ids, context }));
  };
