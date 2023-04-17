import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodes, createReducer } from './utils';

const reloadSharedNodesReducer = createReducer(Realtime.diagram.sharedNodes.reload, (state, { sharedNodes }) => addSharedNodes(state, sharedNodes));

export default reloadSharedNodesReducer;
