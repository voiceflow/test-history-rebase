import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { ConditionPredicateState } from './condition-predicate.state';

export const conditionPredicateReducer = reducerWithInitialState<ConditionPredicateState>(createEmpty())
  .case(Actions.ConditionPredicate.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.ConditionPredicate.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.ConditionPredicate.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.ConditionPredicate.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.ConditionPredicate.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.ConditionPredicate.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
