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
import type { FlowOnlyState } from './flow.state';

export const flowReducer = reducerWithInitialState<FlowOnlyState>(createEmpty())
  .case(Actions.Flow.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Flow.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Flow.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Flow.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Flow.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Flow.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Flow.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
