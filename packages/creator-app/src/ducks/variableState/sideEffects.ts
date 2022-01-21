import * as Realtime from '@voiceflow/realtime-sdk';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import { waitAsync } from '@/ducks/utils';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

// eslint-disable-next-line import/prefer-default-export
export const createVariableState =
  (variableState: Realtime.VariableState): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (!isAtomicActions) return;

    const context = dispatch(getActiveVersionContext());

    await dispatch(waitAsync(Realtime.variableState.create, { ...context, variableState }));
  };
