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

import type { ThreadCommentState } from './thread-comment.state';

export const threadCommentReducer = reducerWithInitialState<ThreadCommentState>(createEmpty())
  .case(Actions.ThreadComment.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.ThreadComment.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.ThreadComment.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.ThreadComment.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.ThreadComment.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.ThreadComment.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.ThreadComment.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
