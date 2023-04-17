import * as Realtime from '@voiceflow/realtime-sdk';

import { importSnapshot } from '@/ducks/creatorV2/reducers/importSnapshot';

import { createReducer } from './utils';

const initializeReducer = createReducer(Realtime.canvasTemplate.initialize, (nextState, { diagramID, ...entities }) => {
  nextState.activeDiagramID = diagramID;

  importSnapshot(nextState, entities);

  return nextState;
});

export default initializeReducer;
