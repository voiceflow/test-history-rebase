import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createActiveDiagramReducer } from './utils';

const updateNodeDataReducer = createActiveDiagramReducer(Realtime.node.updateData, (state, { nodeID, data }) => {
  if (!Normal.hasOne(state.nodes, nodeID)) return;

  Object.assign(state.nodes.byKey[nodeID], data);
});

export default updateNodeDataReducer;
