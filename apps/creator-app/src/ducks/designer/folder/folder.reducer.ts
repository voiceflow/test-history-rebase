import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../utils/action.util';
import type { FolderState } from './folder.state';

export const folderReducer = reducerWithInitialState<FolderState>(createEmpty())
  .case(Actions.Folder.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Folder.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Folder.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Folder.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Folder.PatchOne, (state, action) => patchOne(state, action.payload.id, patchWithUpdatedFields(action)))
  .caseWithAction(Actions.Folder.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
