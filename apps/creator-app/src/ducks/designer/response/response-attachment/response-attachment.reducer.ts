import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { ResponseAttachmentState } from './response-attachment.state';

export const responseAttachmentReducer = reducerWithInitialState<ResponseAttachmentState>(createEmpty())
  .case(Actions.ResponseAttachment.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.ResponseAttachment.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.ResponseAttachment.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.ResponseAttachment.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.ResponseAttachment.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
