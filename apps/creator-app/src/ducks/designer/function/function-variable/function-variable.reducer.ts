import { Actions } from '@voiceflow/sdk-logux-designer';
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

import { patchWithUpdatedFields } from '../../utils/action.util';
import type { FunctionVariableState } from './function-variable.state';

export const functionVariableReducer = reducerWithInitialState<FunctionVariableState>(createEmpty())
  .case(Actions.FunctionVariable.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.FunctionVariable.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.FunctionVariable.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.FunctionVariable.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.FunctionVariable.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.FunctionVariable.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.FunctionVariable.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
