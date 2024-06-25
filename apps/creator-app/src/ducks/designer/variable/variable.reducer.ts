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

import { patchWithUpdatedFields } from '../utils/action.util';
import type { VariableState } from './variable.state';

export const variableReducer = reducerWithInitialState<VariableState>(createEmpty())
  .case(Actions.Variable.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Variable.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Variable.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Variable.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Variable.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Variable.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Variable.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
