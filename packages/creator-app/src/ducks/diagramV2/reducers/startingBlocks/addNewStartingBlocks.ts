/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const addNewStartingBlocks = createReducer(Realtime.diagram.addNewStartingBlocks, (state, { diagramID, startingBlocks }) => {
  if (!startingBlocks.length) return;

  state.startingBlocks[diagramID] ??= {};

  startingBlocks.forEach((startingBlock) => {
    state.startingBlocks[diagramID][startingBlock.blockID] = startingBlock;
  });
});

export default addNewStartingBlocks;
