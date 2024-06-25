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

import { patchWithUpdatedFields } from '../../utils/action.util';
import type { CardButtonState } from './card-button.state';

export const cardButtonReducer = reducerWithInitialState<CardButtonState>(createEmpty())
  .case(Actions.CardButton.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.CardButton.AddMany, (state, { data }) => appendMany(state, data))

  .case(Actions.CardButton.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.CardButton.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.CardButton.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.CardButton.PatchOne, (state, action) =>
    patchOne(state, action.payload.id, patchWithUpdatedFields(action))
  )
  .caseWithAction(Actions.CardButton.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
