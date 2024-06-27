import compositeReducer from 'composite-reducer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as Document from './document';
import * as Integration from './integration';
import * as Settings from './settings';

const knowledgeBaseBaseReducer = reducerWithInitialState({});

export const knowledgeBaseReducer = compositeReducer(knowledgeBaseBaseReducer, {
  [Document.STATE_KEY]: Document.reducer,
  [Settings.STATE_KEY]: Settings.reducer,
  [Integration.STATE_KEY]: Integration.reducer,
});
