import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { DiagramState } from './diagram.state';

export const diagramReducer = reducerWithInitialState<DiagramState>(createEmpty())
  .case(Actions.Diagram.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Diagram.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Diagram.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.Diagram.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.Diagram.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Diagram.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Diagram.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
