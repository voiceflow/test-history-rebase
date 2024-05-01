import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuItem, createReducer, nodeDataToSharedNode } from './utils';

const addBlockReducer = createReducer(
  Realtime.node.addBlock,
  (state, { diagramID, blockName, stepData, blockID, stepID }) => {
    state.sharedNodes[diagramID] ??= {};

    addSharedNodeAndMenuItem(
      state,
      diagramID,
      nodeDataToSharedNode({ name: blockName, nodeID: blockID, type: Realtime.BlockType.COMBINED })
    );
    addSharedNodeAndMenuItem(state, diagramID, nodeDataToSharedNode({ ...stepData, nodeID: stepID }));
  }
);

export default addBlockReducer;
