import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { EventMappingState } from './event-mapping.state';

export const eventMappingReducer = reducerWithInitialState<EventMappingState>(createEmpty())
  .case(Actions.EventMapping.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.EventMapping.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.EventMapping.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.EventMapping.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.EventMapping.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.EventMapping.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
