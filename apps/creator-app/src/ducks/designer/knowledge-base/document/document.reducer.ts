import { appendMany, appendOne, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as Actions from './document.action';
import type { DocumentState } from './document.state';
import { INITIAL_STATE } from './document.state';

const syncCount = (state: DocumentState) => ({ ...state, count: state.allKeys.length });

export const documentReducer = reducerWithInitialState<DocumentState>(INITIAL_STATE)
  .case(Actions.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.AddOne, (state, { data }) => syncCount(appendOne(state, data.id, data)))
  .case(Actions.AddMany, (state, { data }) => syncCount(appendMany(state, data)))
  .case(Actions.DeleteOne, (state, { id }) => syncCount(removeOne(state, id)))
  .case(Actions.DeleteMany, (state, { ids }) => syncCount(removeMany(state, ids)))
  .case(Actions.Replace, (state, { data }) => syncCount({ ...state, ...normalize(data) }))
  .case(Actions.UpdateMany, (state, { update }) =>
    patchMany(
      state,
      update.map((document) => ({ key: document.id, value: document }))
    )
  )
  .case(Actions.SetFetchStatus, (state, { status }) => ({ ...state, fetchStatus: status }))
  .case(Actions.SetCount, (state, { count }) => ({ ...state, count }))
  .case(Actions.SetProcessingIDs, (state, { processingIDs }) => ({ ...state, processingIDs }));
