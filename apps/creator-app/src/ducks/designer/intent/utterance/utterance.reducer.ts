import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { UtteranceState } from './utterance.state';

export const utteranceReducer = reducerWithInitialState<UtteranceState>(createEmpty())
  .case(Actions.Utterance.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Utterance.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Utterance.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Utterance.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Utterance.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Utterance.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Utterance.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
