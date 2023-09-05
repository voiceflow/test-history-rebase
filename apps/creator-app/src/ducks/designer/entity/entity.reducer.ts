import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { EntityState } from './entity.state';
import * as EntityVariant from './entity-variant';

const baseEntityReducer = reducerWithInitialState<EntityState>(createEmpty())
  .case(Actions.Entity.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Entity.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Entity.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Entity.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Entity.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Entity.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Entity.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const entityReducer = compositeReducer(baseEntityReducer, {
  [EntityVariant.STATE_KEY]: EntityVariant.reducer,
});
