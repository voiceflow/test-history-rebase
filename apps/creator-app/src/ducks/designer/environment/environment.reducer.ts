import { Actions } from '@voiceflow/sdk-logux-designer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { SetGateSubscriptionRevision, SetNLUTrainingDiffStatus } from './environment.action';
import type { EnvironmentState } from './environment.state';
import { INITIAL_STATE } from './environment.state';

export const environmentReducer = reducerWithInitialState<EnvironmentState>(INITIAL_STATE)
  .case(Actions.Environment.UpdateNLUTrainingDiff, (state, { hash, data, status }) => ({
    ...state,
    nluTrainingDiff: { hash, data, status },
  }))
  .case(SetNLUTrainingDiffStatus, (state, { status }) => ({
    ...state,
    nluTrainingDiff: { ...state.nluTrainingDiff, status },
  }))
  .case(SetGateSubscriptionRevision, (state, { revision }) => ({ ...state, gateSubscriptionRevision: revision }));
