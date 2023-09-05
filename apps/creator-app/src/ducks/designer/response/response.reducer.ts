import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { ResponseState } from './response.state';
import * as ResponseAttachment from './response-attachment';
import * as ResponseDiscriminator from './response-discriminator';
import * as ResponseVariant from './response-variant';

const baseResponseReducer = reducerWithInitialState<ResponseState>(createEmpty())
  .case(Actions.Response.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Response.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Response.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Response.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Response.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Response.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Response.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const responseReducer = compositeReducer(baseResponseReducer, {
  [ResponseVariant.STATE_KEY]: ResponseVariant.reducer,
  [ResponseAttachment.STATE_KEY]: ResponseAttachment.reducer,
  [ResponseDiscriminator.STATE_KEY]: ResponseDiscriminator.reducer,
});
