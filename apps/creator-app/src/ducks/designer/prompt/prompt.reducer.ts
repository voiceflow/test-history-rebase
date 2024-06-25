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
import type { PromptState } from './prompt.state';

export const promptReducer = reducerWithInitialState<PromptState>(createEmpty())
  .case(Actions.Prompt.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Prompt.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Prompt.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Prompt.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Prompt.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Prompt.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Prompt.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
