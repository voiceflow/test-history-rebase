import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { RequiredEntityState } from './required-entity.state';

export const requiredEntityReducer = reducerWithInitialState<RequiredEntityState>(createEmpty())
  .case(Actions.RequiredEntity.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.RequiredEntity.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.RequiredEntity.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.RequiredEntity.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.RequiredEntity.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.RequiredEntity.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.RequiredEntity.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
