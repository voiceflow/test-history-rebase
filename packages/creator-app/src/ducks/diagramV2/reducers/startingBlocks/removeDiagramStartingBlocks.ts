/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const removeDiagramStartingBlocks = createReducer(Realtime.diagram.removeDiagramStartingBlocks, (state, { removedDiagramID }) => {
  delete state.startingBlocks[removedDiagramID];
});

export default removeDiagramStartingBlocks;
