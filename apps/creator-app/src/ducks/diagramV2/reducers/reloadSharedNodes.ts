import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodes, createReducer } from './utils';

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
const reloadSharedNodesReducer = createReducer(Realtime.diagram.sharedNodes.reload, (state, { sharedNodes }) =>
  addSharedNodes(state, sharedNodes)
);

export default reloadSharedNodesReducer;
