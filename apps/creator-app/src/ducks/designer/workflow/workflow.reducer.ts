import { Actions } from '@voiceflow/sdk-logux-designer';
import { appendMany, appendOne, createEmpty, normalize, patchMany, patchOne, removeMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { patchWithUpdatedFields } from '../utils/action.util';
import type { WorkflowOnlyState } from './workflow.state';

export const workflowReducer = reducerWithInitialState<WorkflowOnlyState>(createEmpty())
  .case(Actions.Workflow.AddOne, (state, { data }) => appendOne(state, data.id, data))
  .case(Actions.Workflow.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.Workflow.DeleteOne, (state, { id }) => removeOne(state, id))
  .case(Actions.Workflow.DeleteMany, (state, { ids }) => removeMany(state, ids))
  .case(Actions.Workflow.Replace, (state, { data }) => ({ ...state, ...normalize(data) }))
  .caseWithAction(Actions.Workflow.PatchOne, (state, action) => patchOne(state, action.payload.id, patchWithUpdatedFields(action)))
  .caseWithAction(Actions.Workflow.PatchMany, (state, action) =>
    patchMany(
      state,
      action.payload.ids.map((id) => ({ key: id, value: patchWithUpdatedFields(action) }))
    )
  );
