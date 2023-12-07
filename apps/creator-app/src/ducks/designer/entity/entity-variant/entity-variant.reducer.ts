import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../../utils/action.util';
import type { EntityVariantState } from './entity-variant.state';

export const entityVariantReducer = reducerWithInitialState<EntityVariantState>(createEmpty())
  .case(Actions.EntityVariant.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.EntityVariant.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.EntityVariant.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.EntityVariant.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.EntityVariant.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.EntityVariant.PatchOne, (state, action) => patchOne(state, action.payload.id, patchWithUpdatedFields(action)))
  .caseWithAction(Actions.EntityVariant.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
