import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import {
  appendMany,
  appendOne,
  createEmpty,
  normalize,
  patchMany,
  patchOne,
  removeMany,
  removeOne,
} from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../utils/action.util';
import type { FunctionState } from './function.state';
import * as FunctionPath from './function-path';
import * as FunctionVariable from './function-variable';

const baseFunctionReducer = reducerWithInitialState<FunctionState>(createEmpty())
  .case(Actions.Function.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Function.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Function.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Function.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Function.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Function.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Function.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );

export const functionReducer = compositeReducer(baseFunctionReducer, {
  [FunctionPath.STATE_KEY]: FunctionPath.reducer,
  [FunctionVariable.STATE_KEY]: FunctionVariable.reducer,
});
