import * as Realtime from '@voiceflow/realtime-sdk';

import { removeManyNodes } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeManyNodesReducer = createActiveDiagramReducer(Realtime.node.removeMany, (state, { nodes }) => {
  const nodeIDs = nodes.map((node) => node.stepID ?? node.blockID);

  removeManyNodes(state, nodeIDs);
});

export default removeManyNodesReducer;
