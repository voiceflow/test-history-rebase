import { appendMany, removeOne } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as Actions from './integration.action';
import { INITIAL_STATE, type KnowledgeBaseIntegrationState } from './integration.state';

export const integrationReducer = reducerWithInitialState<KnowledgeBaseIntegrationState>(INITIAL_STATE)
  .case(Actions.SetIntegrations, (state, { integrations }) => ({
    ...state,
    integrations,
  }))
  .case(Actions.AddMany, (state, { data }) => appendMany(state, data))
  .case(Actions.DeleteOne, (state, { id }) => removeOne(state, id));
