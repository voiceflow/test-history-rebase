import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { ConditionState } from './condition.state';
import * as ConditionAssertion from './condition-assertion';
import * as ConditionPredicate from './condition-predicate';

const baseConditionReducer = reducerWithInitialState<ConditionState>(createEmpty())
  .case(Actions.Condition.Add, (state, { data }) => appendOne(state, data.id, data))
  .cases([Actions.Condition.PatchOneExpression, Actions.Condition.PatchOnePrompt, Actions.Condition.PatchOneScript], (state, { id, patch }) =>
    patchOne(state, id, patch)
  )
  .cases([Actions.Condition.PatchManyExpression, Actions.Condition.PatchManyPrompt, Actions.Condition.PatchManyScript], (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Condition.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Condition.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Condition.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const conditionReducer = compositeReducer(baseConditionReducer, {
  [ConditionAssertion.STATE_KEY]: ConditionAssertion.reducer,
  [ConditionPredicate.STATE_KEY]: ConditionPredicate.reducer,
});
