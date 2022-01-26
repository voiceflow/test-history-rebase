import * as Realtime from '@voiceflow/realtime-sdk';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import { waitAsync } from '@/ducks/utils';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

export const createVariableState =
  (variableState: Realtime.VariableState): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (!isAtomicActions) return;

    const context = dispatch(getActiveVersionContext());

    await dispatch(waitAsync(Realtime.variableState.create, { ...context, variableState }));
  };

export const updateState =
  (variableStateID: string, variableState: Partial<Realtime.VariableState>): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (!isAtomicActions) return;

    const context = dispatch(getActiveVersionContext());

    await dispatch.sync(Realtime.variableState.crud.patch({ ...context, key: variableStateID, value: variableState }));
  };

export const deleteState =
  (variableStateID: string): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (!isAtomicActions) return;

    const context = dispatch(getActiveVersionContext());

    await dispatch.sync(Realtime.variableState.crud.remove({ ...context, key: variableStateID }));
  };
