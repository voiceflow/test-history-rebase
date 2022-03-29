/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const removeStartingBlocksReducer = createReducer(Realtime.diagram.removeStartingBlocks, (state, { diagramID, startingBlockIds }) => {
  if (!startingBlockIds.length) return;

  const diagramStartingBlockMap = state.startingBlocks[diagramID];

  if (diagramStartingBlockMap) {
    startingBlockIds.forEach((blockID) => {
      delete diagramStartingBlockMap[blockID];
    });
  }
});

export default removeStartingBlocksReducer;
