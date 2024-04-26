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
import type { ResponseState } from './response.state';
import * as ResponseAttachment from './response-attachment';
import * as ResponseDiscriminator from './response-discriminator';
import * as ResponseVariant from './response-variant';

const baseResponseReducer = reducerWithInitialState<ResponseState>(createEmpty())
  .case(Actions.Response.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Response.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Response.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Response.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Response.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Response.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Response.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );

export const responseReducer = compositeReducer(baseResponseReducer, {
  [ResponseVariant.STATE_KEY]: ResponseVariant.reducer,
  [ResponseAttachment.STATE_KEY]: ResponseAttachment.reducer,
  [ResponseDiscriminator.STATE_KEY]: ResponseDiscriminator.reducer,
});
