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

import { patchWithUpdatedFields } from '../../utils/action.util';
import type { ResponseVariantState } from './response-variant.state';

export const responseVariantReducer = reducerWithInitialState<ResponseVariantState>(createEmpty())
  .case(Actions.ResponseVariant.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.ResponseVariant.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.ResponseVariant.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.ResponseVariant.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.ResponseVariant.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .casesWithAction(
    [Actions.ResponseVariant.PatchOnePrompt, Actions.ResponseVariant.PatchOneText, Actions.ResponseVariant.PatchOne],
    (state, action) => patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .casesWithAction(
    [Actions.ResponseVariant.PatchManyPrompt, Actions.ResponseVariant.PatchManyText, Actions.ResponseVariant.PatchMany],
    (state, action) =>
      patchMany(
        state,
        action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
      )
  );
