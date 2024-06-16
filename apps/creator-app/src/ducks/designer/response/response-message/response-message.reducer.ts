import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { ResponseMessageState } from './response-message.state';

export const responseMessageReducer = reducerWithInitialState<ResponseMessageState>(createEmpty())
  .case(Actions.ResponseMessage.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.ResponseMessage.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.ResponseMessage.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.ResponseMessage.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.ResponseMessage.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
