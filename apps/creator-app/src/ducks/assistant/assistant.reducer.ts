import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { AssistantOnlyState } from './assistant.state';
import * as Awareness from './assistant-awareness';

const assistantBaseReducer = reducerWithInitialState<AssistantOnlyState>(createEmpty())
  .case(Actions.Assistant.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Assistant.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Assistant.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Assistant.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Assistant.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Assistant.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const assistantReducer = compositeReducer(assistantBaseReducer, {
  [Awareness.STATE_KEY]: Awareness.reducer,
});
