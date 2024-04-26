import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
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
import type { EntityState } from './entity.state';
import * as EntityVariant from './entity-variant';

const baseEntityReducer = reducerWithInitialState<EntityState>(createEmpty())
  .case(Actions.Entity.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Entity.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Entity.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Entity.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Entity.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Entity.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Entity.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );

export const entityReducer = compositeReducer(baseEntityReducer, {
  [EntityVariant.STATE_KEY]: EntityVariant.reducer,
});
