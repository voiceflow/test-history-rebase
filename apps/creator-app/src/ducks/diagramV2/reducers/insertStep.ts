import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuItem, createReducer, nodeDataToSharedNode, removeSharedNodes } from './utils';

const insertStepReducer = createReducer(Realtime.node.insertStep, (state, { diagramID, stepID, data, removeNodes }) => {
  state.sharedNodes[diagramID] ??= {};

  const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

  removeSharedNodes(state, diagramID, removeNodeIDs);

  addSharedNodeAndMenuItem(state, diagramID, nodeDataToSharedNode({ ...data, nodeID: stepID }));
});

export default insertStepReducer;
