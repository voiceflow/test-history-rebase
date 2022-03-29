/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';
import crudReducers from './reducers';

const removeDiagramReducer = createReducer(Realtime.diagram.crud.remove, (state, payload) => {
  const [, crudRemove] = crudReducers.remove;

  crudRemove(state, payload);

  delete state.intentSteps[payload.key];
  delete state.globalIntentStepMap[payload.key];
});

export default removeDiagramReducer;
