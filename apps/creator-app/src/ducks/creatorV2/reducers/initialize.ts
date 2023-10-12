import * as Realtime from '@voiceflow/realtime-sdk';

import { createInitializeState } from '../constants';
import { importSnapshot } from './importSnapshot';
import { createReducer } from './utils';

const initializeReducer = createReducer(Realtime.creator.initialize, (state, { diagramID, ...entities }) => {
  const nextState = createInitializeState(state);

  nextState.activeDiagramID = diagramID;

  importSnapshot(nextState, entities);

  return nextState;
});

export default initializeReducer;
