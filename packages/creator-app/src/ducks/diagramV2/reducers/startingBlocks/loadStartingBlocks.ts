/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';

const loadStartingBlocks = createReducer(Realtime.diagram.loadStartingBlocks, (state, { startingBlocks }) => {
  state.startingBlocks = startingBlocks;
});

export default loadStartingBlocks;
