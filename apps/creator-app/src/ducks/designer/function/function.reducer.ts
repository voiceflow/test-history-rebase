import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { FunctionState } from './function.state';
import * as FunctionPath from './function-path';
import * as FunctionVariable from './function-variable';

const baseFunctionReducer = reducerWithInitialState<FunctionState>(createEmpty())
  .case(Actions.Function.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Function.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Function.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Function.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Function.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Function.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Function.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const functionReducer = compositeReducer(baseFunctionReducer, {
  [FunctionPath.STATE_KEY]: FunctionPath.reducer,
  [FunctionVariable.STATE_KEY]: FunctionVariable.reducer,
});
