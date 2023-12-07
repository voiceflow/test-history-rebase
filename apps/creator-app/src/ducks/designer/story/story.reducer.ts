import { Actions } from '@voiceflow/sdk-logux-designer';
import compositeReducer from 'composite-reducer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../utils/action.util';
import type { StoryState } from './story.state';
import * as Trigger from './trigger';

export const baseStoryReducer = reducerWithInitialState<StoryState>(createEmpty())
  .case(Actions.Story.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Story.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Story.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Story.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Story.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Story.PatchOne, (state, action) => patchOne(state, action.payload.id, patchWithUpdatedFields(action)))
  .caseWithAction(Actions.Story.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );

export const storyReducer = compositeReducer(baseStoryReducer, {
  [Trigger.STATE_KEY]: Trigger.reducer,
});
