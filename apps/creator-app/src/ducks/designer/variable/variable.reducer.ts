import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { VariableState } from './variable.state';

export const variableReducer = reducerWithInitialState<VariableState>(createEmpty())
  .case(Actions.Variable.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Variable.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Variable.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Variable.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Variable.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Variable.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
