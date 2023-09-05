import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { FolderState } from './folder.state';

export const folderReducer = reducerWithInitialState<FolderState>(createEmpty())
  .case(Actions.Folder.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Folder.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Folder.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Folder.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Folder.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Folder.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
