import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuItem, createReducer, nodeDataToSharedNode } from './utils';

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
const isolateStepsReducer = createReducer(
  Realtime.node.isolateSteps,
  (state, { diagramID, parentNodeID, parentNodeData }) => {
    state.sharedNodes[diagramID] ??= {};

    addSharedNodeAndMenuItem(
      state,
      diagramID,
      nodeDataToSharedNode({ name: parentNodeData.name, nodeID: parentNodeID, type: parentNodeData.type })
    );
  }
);

export default isolateStepsReducer;
