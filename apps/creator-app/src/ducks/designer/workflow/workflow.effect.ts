import type { Workflow } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { notify } from '@voiceflow/ui-next';

import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

import { waitAsync } from '../../utils';

export const createOne =
  (data: Actions.Workflow.CreateData): Thunk<Workflow> =>
  async (dispatch, getState) => {
    const state = getState();
    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Workflow.CreateOne, { context, data }));

    return response.data;
  };

export const duplicateOne =
  (flowID: string): Thunk<Actions.Workflow.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const { data } = await dispatch(waitAsync(Actions.Workflow.DuplicateOne, { context, data: { flowID } }));

    notify.short.success('Duplicated');

    return data;
  };

export const copyPasteMany =
  (request: Actions.Workflow.CopyPasteMany.Request['data']): Thunk<Actions.Workflow.CopyPasteMany.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const { data } = await dispatch(waitAsync(Actions.Workflow.CopyPasteMany, { context, data: request }));

    return data;
  };

export const patchOne =
  (id: string, patch: Actions.Workflow.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.PatchOne({ context, id, patch }));
  };

export const patchMany =
  (ids: string[], patch: Actions.Workflow.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.PatchMany({ context, ids, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.DeleteMany({ context, ids }));
  };
