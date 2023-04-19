import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer, removeSharedNodes } from './utils';

const removeManyNodesReducer = createReducer(Realtime.node.removeMany, (state, { diagramID, nodes }) => {
  if (!nodes.length) return;

  const nodeIDs = nodes.map((node) => node.stepID ?? node.parentNodeID);

  removeSharedNodes(state, diagramID, nodeIDs);
});

export default removeManyNodesReducer;
