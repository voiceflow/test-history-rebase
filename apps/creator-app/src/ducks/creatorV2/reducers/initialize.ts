import * as Realtime from '@voiceflow/realtime-sdk';

import { createInitialState } from '../constants';
import { importSnapshot } from './importSnapshot';
import { createReducer } from './utils';

const initializeReducer = createReducer(Realtime.creator.initialize, (_, { diagramID, ...entities }) => {
  const nextState = createInitialState();

  nextState.activeDiagramID = diagramID;

  importSnapshot(nextState, entities);

  return nextState;
});

export default initializeReducer;
