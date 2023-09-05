import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { FunctionPathState } from './function-path.state';

export const functionPathReducer = reducerWithInitialState<FunctionPathState>(createEmpty())
  .case(Actions.FunctionPath.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.FunctionPath.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.FunctionPath.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.FunctionPath.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.FunctionPath.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.FunctionPath.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.FunctionPath.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
