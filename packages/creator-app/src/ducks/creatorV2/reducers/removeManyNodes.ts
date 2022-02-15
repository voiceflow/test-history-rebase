import * as Realtime from '@voiceflow/realtime-sdk';

import { removeManyNodes } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeManyNodesReducer = createActiveDiagramReducer(Realtime.node.removeMany, (state, { nodeIDs }) => {
  removeManyNodes(state, nodeIDs);
});

export default removeManyNodesReducer;
