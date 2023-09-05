import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { ResponseVariantState } from './response-variant.state';

export const responseVariantReducer = reducerWithInitialState<ResponseVariantState>(createEmpty())
  .case(Actions.ResponseVariant.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.ResponseVariant.AddMany, (state, { data }) => appendMany(state, data))
  .cases(
    [
      Actions.ResponseVariant.PatchOneJSON,
      Actions.ResponseVariant.PatchOnePrompt,
      Actions.ResponseVariant.PatchOneText,
      Actions.ResponseVariant.PatchOne,
    ],
    (state, { id, patch }) => patchOne(state, id, patch)
  )
  .cases(
    [
      Actions.ResponseVariant.PatchManyJSON,
      Actions.ResponseVariant.PatchManyPrompt,
      Actions.ResponseVariant.PatchManyText,
      Actions.ResponseVariant.PatchMany,
    ],
    (state, { ids, patch }) =>
      patchMany(
        state,
        ids.map((id) => ({ key: id, value: patch }))
      )
  )
  .case(Actions.ResponseVariant.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.ResponseVariant.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.ResponseVariant.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
