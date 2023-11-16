import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type ThreadState } from './thread.state';
import * as ThreadComment from './thread-comment';

const baseThreadReducer = reducerWithInitialState<ThreadState>(INITIAL_STATE)
  .case(Actions.Thread.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Thread.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Thread.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Thread.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Thread.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Thread.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Thread.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const threadReducer = compositeReducer(baseThreadReducer, {
  [ThreadComment.STATE_KEY]: ThreadComment.reducer,
});
