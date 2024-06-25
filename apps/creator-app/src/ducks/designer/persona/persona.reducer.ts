import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../utils/action.util';
import type { PersonaState } from './persona.state';
import * as PersonaOverride from './persona-override';

const rootPersonaReducer = reducerWithInitialState<PersonaState>(createEmpty())
  .case(Actions.Persona.Add, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Persona.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Persona.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Persona.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Persona.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.Persona.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );

export const personaReducer = compositeReducer(rootPersonaReducer, {
  [PersonaOverride.STATE_KEY]: PersonaOverride.reducer,
});
