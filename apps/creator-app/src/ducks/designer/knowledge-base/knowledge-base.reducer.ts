import compositeReducer from 'composite-reducer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as Document from './document';
import * as Actions from './knowledge-base.action';
import { INITIAL_STATE, type KnowledgeBaseOnlyState } from './knowledge-base.state';

const knowledgeBaseBaseReducer = reducerWithInitialState<KnowledgeBaseOnlyState>(INITIAL_STATE)
  .case(Actions.SetSettings, (state, { settings }) => ({
    ...state,
    settings,
  }))
  .case(Actions.PatchSettings, (state, { patch }) => ({
    ...state,
    settings: state.settings && { ...state.settings, ...patch },
  }));

export const knowledgeBaseReducer = compositeReducer(knowledgeBaseBaseReducer, {
  [Document.STATE_KEY]: Document.reducer,
});
