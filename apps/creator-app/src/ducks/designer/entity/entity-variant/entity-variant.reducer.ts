import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { EntityVariantState } from './entity-variant.state';

export const entityVariantReducer = reducerWithInitialState<EntityVariantState>(createEmpty())
  .case(Actions.EntityVariant.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.EntityVariant.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.EntityVariant.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.EntityVariant.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.EntityVariant.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.EntityVariant.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.EntityVariant.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
