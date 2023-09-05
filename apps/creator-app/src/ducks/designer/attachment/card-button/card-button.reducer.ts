import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { CardButtonState } from './card-button.state';

export const cardButtonReducer = reducerWithInitialState<CardButtonState>(createEmpty())
  .case(Actions.CardButton.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.CardButton.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.CardButton.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.CardButton.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.CardButton.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.CardButton.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.CardButton.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
