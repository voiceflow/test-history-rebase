import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { IntentState } from './intent.state';
import * as RequiredEntity from './required-entity';
import * as Utterance from './utterance';

const baseIntentReducer = reducerWithInitialState<IntentState>(createEmpty())
  .case(Actions.Intent.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Intent.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Intent.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Intent.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Intent.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Intent.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Intent.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const intentReducer = compositeReducer(baseIntentReducer, {
  [RequiredEntity.STATE_KEY]: RequiredEntity.reducer,
  [Utterance.STATE_KEY]: Utterance.reducer,
});
