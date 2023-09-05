import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { AttachmentState } from './attachment.state';
import * as CardButton from './card-button';

const baseAttachmentReducer = reducerWithInitialState<AttachmentState>(createEmpty())
  .case(Actions.Attachment.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Attachment.AddMany, (state, { data }) => appendMany(state, data))
  .cases([Actions.Attachment.PatchOneCard, Actions.Attachment.PatchOneMedia], (state, { id, patch }) => patchOne(state, id, patch))
  .cases([Actions.Attachment.PatchManyCard, Actions.Attachment.PatchManyMedia], (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Attachment.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Attachment.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Attachment.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));

export const attachmentReducer = compositeReducer(baseAttachmentReducer, {
  [CardButton.STATE_KEY]: CardButton.reducer,
});
