import { Utils } from '@voiceflow/common';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { FlowAwarenessState } from './flow-awareness.state';
import { INITIAL_STATE } from './flow-awareness.state';

export const awarenessReducer = reducerWithInitialState<FlowAwarenessState>(INITIAL_STATE)
  .case(Actions.FlowAwareness.LockEntities, (state, { type, ids, context: { flowID }, loguxNodeID }) => ({
    ...state,
    locks: {
      ...state.locks,
      [flowID]: {
        ...state.locks[flowID],
        [type]: {
          ...state.locks[flowID]?.[type],
          ...Object.fromEntries(ids.map((id) => [id, loguxNodeID])),
        },
      },
    },
  }))
  .case(Actions.FlowAwareness.UnlockEntities, (state, { type, ids, context: { flowID } }) => ({
    ...state,
    locks: {
      ...state.locks,
      [flowID]: {
        ...state.locks[flowID],
        [type]: Utils.object.omit(state.locks[flowID]?.[type] ?? {}, ids),
      },
    },
  }))
  .case(Actions.FlowAwareness.UpdateLockedEntities, (state, { locks, context: { flowID } }) => ({
    ...state,
    locks: {
      ...state.locks,
      [flowID]: locks,
    },
  }))
  .case(Actions.Flow.DeleteOne, (state, { id }) => ({
    ...state,
    locks: Utils.object.omit(state.locks, [id]),
  }))
  .case(Actions.Flow.DeleteMany, (state, { ids }) => ({
    ...state,
    locks: Utils.object.omit(state.locks, ids),
  }));
