/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuItem, createReducer, nodeDataToSharedNode } from './utils';

const insertStepReducer = createReducer(Realtime.node.insertStep, (state, { diagramID, stepID, data }) => {
  state.sharedNodes[diagramID] ??= {};

  addSharedNodeAndMenuItem(state, diagramID, nodeDataToSharedNode({ ...data, nodeID: stepID }));
});

export default insertStepReducer;
