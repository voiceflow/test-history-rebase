import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer, removeSharedNodes } from './utils';

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
const removeManyNodesReducer = createReducer(Realtime.node.removeMany, (state, { diagramID, nodes }) => {
  if (!nodes.length) return;

  const nodeIDs = nodes.map((node) => node.stepID ?? node.parentNodeID);

  removeSharedNodes(state, diagramID, nodeIDs);
});

export default removeManyNodesReducer;
