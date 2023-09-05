import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { ConditionAssertionState } from './condition-assertion.state';

export const conditionAssertionReducer = reducerWithInitialState<ConditionAssertionState>(createEmpty())
  .case(Actions.ConditionAssertion.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.ConditionAssertion.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.ConditionAssertion.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.ConditionAssertion.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.ConditionAssertion.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.ConditionAssertion.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
