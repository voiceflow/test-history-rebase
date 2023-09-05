import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { FlowOnlyState } from './flow.state';
import * as Awareness from './flow-awareness';

const flowBaseReducer = reducerWithInitialState<FlowOnlyState>(createEmpty())
  .case(Actions.Flow.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Flow.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Flow.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Flow.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Flow.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Flow.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Flow.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const flowReducer = compositeReducer(flowBaseReducer, {
  [Awareness.STATE_KEY]: Awareness.reducer,
});
