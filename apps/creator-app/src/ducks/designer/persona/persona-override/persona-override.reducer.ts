import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../../utils/action.util';
import type { PersonaOverrideState } from './persona-override.state';

export const personaOverrideReducer = reducerWithInitialState<PersonaOverrideState>(createEmpty())
  .case(Actions.PersonaOverride.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.PersonaOverride.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.PersonaOverride.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.PersonaOverride.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.PersonaOverride.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.PersonaOverride.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
