import { appendMany, appendOne, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as Actions from './document.action';
import type { DocumentState } from './document.state';
import { INITIAL_STATE } from './document.state';

export const documentReducer = reducerWithInitialState<DocumentState>(INITIAL_STATE)
  .case(Actions.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .case(Actions.UpdateMany, (state, { update }) =>
    patchMany(
      state,
      update.map((document) => ({ key: document.id, value: document }))
    )
  )
  .case(Actions.SetFetchStatus, (state, { status }) => ({ ...state, fetchStatus: status }))
  .case(Actions.SetProcessingIDs, (state, { processingIDs }) => ({ ...state, processingIDs }));
