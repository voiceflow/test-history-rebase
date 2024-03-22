import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../../utils/action.util';
import type { TriggerState } from './trigger.state';

export const triggerReducer = reducerWithInitialState<TriggerState>(createEmpty())
  .case(Actions.Trigger.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Trigger.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Trigger.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Trigger.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Trigger.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Trigger.PatchOne, (state, action) => patchOne(state, action.payload.id, patchWithUpdatedFields(action)))
  .caseWithAction(Actions.Trigger.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );