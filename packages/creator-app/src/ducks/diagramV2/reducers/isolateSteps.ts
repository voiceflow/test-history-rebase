/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuNode, createReducer, nodeDataToSharedNode } from './utils';

const isolateStepsReducer = createReducer(Realtime.node.isolateSteps, (state, { diagramID, parentNodeID, parentNodeData }) => {
  state.sharedNodes[diagramID] ??= {};

  addSharedNodeAndMenuNode(state, diagramID, nodeDataToSharedNode({ name: parentNodeData.name, nodeID: parentNodeID, type: parentNodeData.type }));
});

export default isolateStepsReducer;
