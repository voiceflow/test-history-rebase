import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { PromptState } from './prompt.state';

export const promptReducer = reducerWithInitialState<PromptState>(createEmpty())
  .case(Actions.Prompt.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Prompt.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Prompt.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Prompt.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Prompt.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Prompt.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Prompt.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
