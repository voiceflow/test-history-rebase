import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../../utils/action.util';
import type { EventMappingState } from './event-mapping.state';

export const eventMappingReducer = reducerWithInitialState<EventMappingState>(createEmpty())
  .case(Actions.EventMapping.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.EventMapping.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.EventMapping.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.EventMapping.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.EventMapping.PatchOne, (state, action) => patchOne(state, action.payload.id, patchWithUpdatedFields(action)))
  .caseWithAction(Actions.EventMapping.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
