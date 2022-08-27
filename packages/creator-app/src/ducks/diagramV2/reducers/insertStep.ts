/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuNode, createReducer, nodeDataToSharedNode } from './utils';

const insertStepReducer = createReducer(Realtime.node.insertStep, (state, { diagramID, stepID, data }) => {
  state.sharedNodes[diagramID] ??= {};

  addSharedNodeAndMenuNode(state, diagramID, nodeDataToSharedNode({ ...data, nodeID: stepID }));
});

export default insertStepReducer;
