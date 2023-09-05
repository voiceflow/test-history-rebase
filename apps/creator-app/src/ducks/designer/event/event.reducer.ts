import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { EventState } from './event.state';
import * as EventMapping from './event-mapping';

const baseEventReducer = reducerWithInitialState<EventState>(createEmpty())
  .case(Actions.Event.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Event.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Event.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Event.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Event.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Event.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const eventReducer = compositeReducer(baseEventReducer, {
  [EventMapping.STATE_KEY]: EventMapping.reducer,
});
