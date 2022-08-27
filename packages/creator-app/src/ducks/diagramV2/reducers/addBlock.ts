/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuNode, createReducer, nodeDataToSharedNode } from './utils';

const addBlockReducer = createReducer(Realtime.node.addBlock, (state, { diagramID, blockName, stepData, blockID, stepID }) => {
  state.sharedNodes[diagramID] ??= {};

  addSharedNodeAndMenuNode(state, diagramID, nodeDataToSharedNode({ name: blockName, nodeID: blockID, type: Realtime.BlockType.COMBINED }));
  addSharedNodeAndMenuNode(state, diagramID, nodeDataToSharedNode({ ...stepData, nodeID: stepID }));
});

export default addBlockReducer;
