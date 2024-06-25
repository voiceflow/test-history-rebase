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
import type { FunctionPathState } from './function-path.state';

export const functionPathReducer = reducerWithInitialState<FunctionPathState>(createEmpty())
  .case(Actions.FunctionPath.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.FunctionPath.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.FunctionPath.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.FunctionPath.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.FunctionPath.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.FunctionPath.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.FunctionPath.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
