/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodes, createReducer } from './utils';

const loadSharedNodesReducer = createReducer(Realtime.diagram.sharedNodes.load, (state, { sharedNodes }) => {
  state.sharedNodes = {};
  state.globalIntentStepMap = {};

  addSharedNodes(state, sharedNodes);
});

export default loadSharedNodesReducer;
