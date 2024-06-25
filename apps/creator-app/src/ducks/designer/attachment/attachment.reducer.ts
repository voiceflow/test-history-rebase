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
import type { AttachmentState } from './attachment.state';
import * as CardButton from './card-button';

const baseAttachmentReducer = reducerWithInitialState<AttachmentState>(createEmpty())
  .case(Actions.Attachment.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Attachment.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Attachment.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Attachment.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Attachment.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Attachment.PatchOneCard, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Attachment.PatchOneMedia, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Attachment.PatchManyCard, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  )
  .caseWithAction(Actions.Attachment.PatchManyMedia, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );

export const attachmentReducer = compositeReducer(baseAttachmentReducer, {
  [CardButton.STATE_KEY]: CardButton.reducer,
});
