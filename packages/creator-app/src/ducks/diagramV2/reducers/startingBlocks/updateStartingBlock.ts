/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const updateStartingBlock = createReducer(Realtime.diagram.updateStartingBlock, (state, { diagramID, startingBlock }) => {
  const diagram = state.startingBlocks[diagramID];

  if (diagram) {
    diagram[startingBlock.blockID] = startingBlock;
  }
});

export default updateStartingBlock;
