import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import type { PersonaOverrideState } from './persona-override.state';

export const personaOverrideReducer = reducerWithInitialState<PersonaOverrideState>(createEmpty())
  .case(Actions.PersonaOverride.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.PersonaOverride.PatchOne, (state, { id, patch }) => patchOne(state, id, patch))
  .case(Actions.PersonaOverride.PatchMany, (state, { ids, patch }) =>
    patchMany(
      state,
      ids.map((id) => ({ key: id, value: patch }))
    )
  )
  .case(Actions.PersonaOverride.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.PersonaOverride.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.PersonaOverride.Replace, (state, { data }) => ({ ...state, ...normalize(data) }));
