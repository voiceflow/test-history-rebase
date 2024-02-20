import type { Variable } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { waitAsync } from '@/ducks/utils';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

import * as VariableSelectors from './variable.select';
import * as VariableTracking from './variable.tracking';

export const createOne =
  (data: Actions.Variable.CreateData): Thunk<Variable> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Variable.CreateOne, { context, data }));

    dispatch(VariableTracking.created({ id: response.data.id }));

    return response.data;
  };

export const patchOne =
  (id: string, patch: Actions.Variable.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    const initialDefaultValue = VariableSelectors.oneByID(state, { id })?.defaultValue;

    await dispatch.sync(Actions.Variable.PatchOne({ context, id, patch }));

    dispatch(VariableTracking.updated({ id }));

    if (patch.defaultValue) {
      dispatch(VariableTracking.defaultValueSet({ updated: !!initialDefaultValue }));
    }
  };

export const patchMany =
  (ids: string[], patch: Actions.Variable.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Variable.PatchMany({ context, ids, patch }));

    dispatch(VariableTracking.updated({ ids }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Variable.DeleteOne({ context, id }));

    dispatch(VariableTracking.deleted({ count: 1 }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Variable.DeleteMany({ context, ids }));

    dispatch(VariableTracking.deleted({ count: ids.length }));
  };
